/** 
 * @fileoverview TransferCase.js:
 * This file contains the form and field configurations for the UC003 - Transfer 
 * Case screen.
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 * 16/11/2006 - Chris Vincent, fixed UCT Defect 684 by filtering the Transfer To Court LOV, autocomplete
 * 				and Code fields to prevent user from transferring to CCBC (335).
 * 16/11/2006 - Chris Vincent, added error message to the Transfer To Court Code field if the case status
 * 				is SETTLED/WDRN.  UCT Defect 683.
 * 16/11/2006 - Chris Vincent, fixed UCT defect 689 by preventing the warning message DATEOVER1MONTH_MESSAGE
 * 				from appearing even when the case is pending transfer.
 * 16/11/2006 - Chris Vincent, introduced the unsaved changes warning message on the Status_CloseButton
 * 				as part of UCT Defect 690.
 * 13/06/2007 - Chris Vincent, changes for UCT Group2 Defect 1406 and CaseMan Defect 6316.  Allowed the user
 * 				to select CCBC as a transfer to court, but only if the user is a CCBC Manager.  Also, allowed
 * 				the user to clear the Transfer To court code field if the case is either a transferred complex
 * 				case (6316) or the case is a former CCBC case transferred to legacy CaseMan by mistake (1406).
 * 20/05/2011 - Chris Vincent, Added new Produce Transfer Notice checkbox to allow users to not produce
 *				the Transfer Out CJR018 output and the transfer is completed in a single transaction.  Some
 *				logic handling transfers to Legacy CM also removed as now redundant.  Trac 4216.
 * 11/06/2012 - Chris Vincent, change to Header_CaseNumber.onSuccess to prompt the user to complete or reset the
 *				transfer should a case be loaded that is pending transfer.  Trac 4692.
 * 13/10/2016 - Chris Vincent.  ew Case Type field disabled for family enforcement cases.  Trac 5879
 */

/****************************** CONSTANTS *****************************************/

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.DATA_XPATH = "/ds/TransferCase";
XPathConstants.SYSTEMDATE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDate";
XPathConstants.NAVIGATION_DATA_XPATH = XPathConstants.VAR_PAGE_XPATH + "/NavigationList";
XPathConstants.DATEOFTRANSFER_XPATH = XPathConstants.DATA_XPATH + "/DateOfTransfer";
XPathConstants.CASEPENDINGTRANSFER_XPATH = XPathConstants.VAR_PAGE_XPATH + "/CasePendingTransfer";

/**
 * Transfer Constants
 * @author rzxd7g
 * 
 */
function TransferCaseStatusDescriptions() {};
TransferCaseStatusDescriptions.TOBE_TRANSFERRED = "TO BE TRANSFERRED";
TransferCaseStatusDescriptions.TRANSFERRED_ELECT = "TRANSFERRED ELECTRONICALLY";
TransferCaseStatusDescriptions.TRANSFERRED_MAN = "TRANSFERRED MANUALLY";

/**
 * Jurisdiction Type Constants
 * @author rzxd7g
 * 
 */
function JurisdictionTypeCodes() {};
JurisdictionTypeCodes.HIGH_COURT = "HC";
JurisdictionTypeCodes.COUNTY_COURT = "CC";

/************************** HELPER FUNCTIONS **************************************/

/**
 * Function handles the exit from the screen, checking if a call stack exists.  If a 
 * stack does not exist, then navigates to the main menu.
 * @author rzxd7g
 * 
 */
function exitScreen()
{
	// Clear any relevant form parameters
	Services.removeNode(TransferCaseParams.PARENT);
	Services.removeNode(CaseManFormParameters.WPNODE_XPATH);
	
	if ( NavigationController.callStackExists() )
	{
		// Call stack exists, go to the next screen
		NavigationController.nextScreen();
	}
	else
	{
		// return to the Main Menu screen
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/*********************************************************************************/

/**
 * Function retrieves the case data from the database
 * @author rzxd7g
 * 
 */
function retrieveCaseData()
{
	var caseNumber = Services.getValue(TransferCaseParams.CASE_NUMBER);
	var params = new ServiceParams();
	params.addSimpleParameter("caseNumber", caseNumber);
	Services.callService("getTransferCase", params, Header_CaseNumber, true);
}

/*********************************************************************************/

/**
 * Function indicates if the currently loaded case is pending transfer
 * @returns Boolean true if case is pending transfer
 * @author rzxd7g
 */
function isCasePendingTransfer()
{
	var pendingInd = Services.getValue(XPathConstants.CASEPENDINGTRANSFER_XPATH);
	if ( pendingInd == "true" )
	{
		return true;
	}
	return false;
}

/*********************************************************************************/

/**
 * Function clears the transfer data
 * @author rzxd7g
 * 
 */
function clearTransferData()
{
	// Court Code cleared so clear all dependant fields
	Services.startTransaction();
	Services.setValue(TransferCase_TransferCourtName.dataBinding, "");
	Services.setValue(TransferCase_TransferReason.dataBinding, "");
	Services.setValue(TransferCase_TransferRequestDate.dataBinding, "");
	Services.setValue(XPathConstants.DATEOFTRANSFER_XPATH, "");
	Services.setValue(TransferCase_TransferStatus.dataBinding, "");
	Services.setValue(TransferCase_NewCaseType.dataBinding, "");
	Services.setValue(TransferCase_ProduceNotice.dataBinding, "false");
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * Generic function used to call a commit service.  The commit service name is passed
 * in but the parameters are the same
 * @param [String] pServiceName The name of the commit parameter
 * @author rzxd7g
 * 
 */
function callCommitService(pServiceName)
{
	// Build the data node to pass to the service
	var DataNode = XML.createDOM(null, null, null);
	DataNode.appendChild(Services.getNode(XPathConstants.DATA_XPATH));
	
	var newCaseType = Services.getValue(TransferCase_NewCaseType.dataBinding);
	if ( CaseManUtils.isBlank(newCaseType) )
	{
		// Have to copy the old case type to the new case type xpath or service will fail
		var oldCaseType = Services.getValue(Header_CaseType.dataBinding);
		DataNode.selectSingleNode("/TransferCase/NewCaseType").appendChild( DataNode.createTextNode( oldCaseType ) );
	}
	
	// Call the service
	var params = new ServiceParams();
	params.addDOMParameter("transferCase", DataNode);
	Services.callService(pServiceName, params, Status_SaveButton, true);
}

/*********************************************************************************/

/**
 * Function determines whether or not the currently loaded case record is considered complex.
 * The definition of complex is a case containing a party which is unsupported by legacy CaseMan
 * e.g. More than 1 Claimant, more than 9 Defendants or a part 20 claimant/defendant.
 * Note, it does not bother checking for insoolvency party types as these cannot be transferred
 * to legacy.
 *
 * @return [Boolean] True if the case is complex, else false
 * @author rzxd7g
 */
function isComplexCase()
{
	var complexCase = false;
	var countClaimants = Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/Party[./PartyRoleCode = '" + PartyTypeCodesEnum.CLAIMANT + "']");
	var countDefendants = Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/Party[./PartyRoleCode = '" + PartyTypeCodesEnum.DEFENDANT + "']");
	var countPart20Parties = Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/Party[./PartyRoleCode = '" + PartyTypeCodesEnum.PART_20_DEFENDANT + "' or ./PartyRoleCode = '" + PartyTypeCodesEnum.PART_20_CLAIMANT + "']");
	
	// Legacy only have 1 claimant, up to 9 defendants and no part 20 parties
	if ( countClaimants > 1 || countDefendants > 9 || countPart20Parties > 0 )
	{
		complexCase = true;
	}
	return complexCase;
}

/*********************************************************************************/

/**
 * Function determines whether or not the currently loaded case record is a transferred CCBC
 * Case (transferred to Legacy CaseMan).  Query to determine /PreviousCCBCCase looks at whether
 * the Solicitor of Claimant 1 is a national coded party (1500-1999) or the Creditor Code on the
 * Case is 1999 (MCOL).
 *
 * @return [Boolean] True if the case is a transferred CCBC case, else false
 * @author rzxd7g
 */
function isTransferredCCBCCase()
{
	// Get indicator of whether solicitor of claimant 1 is a national coded party
	var hasNationalCodedParty = Services.getValue(XPathConstants.DATA_XPATH + "/HasNationalCodedParty");
	
	// Get the creditor code of the case (MCOL cases will be 1999)
	var creditorCode = Services.getValue(XPathConstants.DATA_XPATH + "/CreditorCode");
	
	var isTransferredCCBCCase = false;
	if ( hasNationalCodedParty == "true" || creditorCode == CaseManUtils.MCOL_CRED_CODE )
	{
		isTransferredCCBCCase = true;
	}
	return isTransferredCCBCCase;
}

/*********************************************************************************/

/**
 * Function handles the navigation processes following the transfer of a Case
 */
function handlePostTransferNavigation()
{
	// Determine which screens to navigate to
	var setupNavArray = false;
	var NavObl = Services.getValue(XPathConstants.NAVIGATION_DATA_XPATH + "/NavigateTo/Obligations");
	var NavWP = Services.getValue(XPathConstants.NAVIGATION_DATA_XPATH + "/NavigateTo/WordProcessing");
	var ProduceNotice = Services.getValue(TransferCase_ProduceNotice.dataBinding);
	
	// Set up the Navigation Array and set parameters in app section
	var navArray = new Array();
	
	if ( NavObl == "true" )
	{
		// Navigating to Obligations Screen, set parameters
		setupNavArray = true;
		var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
		Services.setValue(MaintainObligationsParams.CASE_NUMBER, caseNumber);
		Services.setValue(MaintainObligationsParams.MAINTENANCE_MODE, "M");

		navArray.push(NavigationController.OBLIGATIONS_FORM);
	}
	
	if ( NavWP == "true" && ProduceNotice == "true" )
	{
		// Navigating to the Word Processing screen(s)
		setupNavArray = true;

		// Add WP Node to the app section of the DOM
		// SERVER DATA TO SEND TO WP
		var wpNode = Services.getNode(XPathConstants.NAVIGATION_DATA_XPATH + "/Params/WordProcessing");
		var wpDom = XML.createDOM();
		wpDom.loadXML(wpNode.xml);
		
		Services.replaceNode(CaseManFormParameters.WPNODE_XPATH, wpNode);
		navArray.push(NavigationController.WP_FORM);
	}
	
	if ( setupNavArray )
	{
		/* Add the Transfer Case screen to the end of the array so will return to this
		 * screen after word processing.  Also mark the case for transfer completion 
		 * upon return to this screen.
		 */
		navArray.push(NavigationController.TRANSFER_CASE_FORM);
		NavigationController.createCallStack(navArray);
	}
	Services.endTransaction();
	
	// Handle Navigation from the screen
	var blnNavigating = false;
	for ( var i=0, l=navArray.length; i<l; i++ )
	{
		switch (navArray[i])
		{
			// Handle Navigation to Obligations screen
			case NavigationController.OBLIGATIONS_FORM:
				blnNavigating = true;
				NavigationController.nextScreen();
				break;
			
			// Handle Navigation to Word Processing Screens
			case NavigationController.WP_FORM:
				// Skip screen so does not go to surrogate WP page
				NavigationController.skipScreen();
				var nextScreen = NavigationController.getNextScreen();
				NavigationController.skipScreen();
				
				// Make call to WP Controller
				Services.setValue(CaseManFormParameters.WPNODE_XPATH  +"/Request", "Create");
				var wpNode = Services.getNode(CaseManFormParameters.WPNODE_XPATH);
				var wpDom = XML.createDOM();
				wpDom.loadXML(wpNode.xml);
				WP.ProcessWP(FormController.getInstance(), wpDom, nextScreen, true );
				break;
		}
		
		// Exit the loop if 
		if ( blnNavigating ) { break; }
	}
	
	// If not navigating and user does not want to Produce the output, retrieve data
	if ( !blnNavigating && ProduceNotice == "false" )
	{
		retrieveCaseData();
	}
}

/****************************** MAIN FORM *****************************************/

function transferCase() {}

/**
 * @author rzxd7g
 * 
 */
transferCase.initialise = function()
{
	// Check if Case Number passed in
	var caseNumber = Services.getValue(TransferCaseParams.CASE_NUMBER);
	if ( !CaseManUtils.isBlank(caseNumber) )
	{
		// Check whether need to complete the transfer or not
		var completeTransferInd = Services.getValue(TransferCaseParams.COMPLETE_TRANSFER_IND);
		if ( completeTransferInd == "true" )
		{
			// Complete the transfer before retrieving data
			var params = new ServiceParams();
			params.addSimpleParameter("caseNumber", caseNumber);
			Services.callService("completeTransferCase", params, Header_CaseNumber, true);
		}
		else
		{
			// No need to complete the transfer, call retrieval service
			retrieveCaseData();
		}
	}
	else
	{
		// Exit screen if no case number passed in
		exitScreen();
	}
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
transferCase.onSuccess = function(dom)
{
	// Handle the generation of the District Judges Report
	Services.setTransientStatusBarMessage("Report generated successfully.");
}

// Load the reference data from the xml into the model
transferCase.refDataServices = [
	{ name:"TransferReasonsList", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getTransferReasonList", serviceParams:[] },
	{ name:"Courts",              dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCourtsShort",        serviceParams:[] },
	{ name:"SystemDate",          dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate",         serviceParams:[] }
];

/******************************** SUBFORMS ***************************************/

function ProgressBar_SubForm() {}
ProgressBar_SubForm.subformName = "CasemanWpOrarepProgress";

/******************************** LOV POPUPS ***************************************/

function TransferCase_TransferCourtLOVGrid() {};
TransferCase_TransferCourtLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubForms/TransferCourtCode";
TransferCase_TransferCourtLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
TransferCase_TransferCourtLOVGrid.rowXPath = "Court";
TransferCase_TransferCourtLOVGrid.keyXPath = "Code";
TransferCase_TransferCourtLOVGrid.columns = [
	{xpath: "Code", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"}
];

TransferCase_TransferCourtLOVGrid.styleURL = "../common_lov_subforms/CourtsLOVGrid.css";
TransferCase_TransferCourtLOVGrid.destroyOnClose = false;
TransferCase_TransferCourtLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "TransferCase_TransferCourtLOVButton"} ],
		keys: [ 
			{ key: Key.F6, element: "TransferCase_TransferCourtCode" }, 
			{ key: Key.F6, element: "TransferCase_TransferCourtName" } 
		],
		enableOn: [XPathConstants.CASEPENDINGTRANSFER_XPATH],
		isEnabled: function()
		{
			return isCasePendingTransfer() ? false : true;
		}
	}
};

/**
 * @author rzxd7g
 * @return "TransferCase_TransferCourtCode"  
 */
TransferCase_TransferCourtLOVGrid.nextFocusedAdaptorId = function() {
	return "TransferCase_TransferCourtCode";
}

TransferCase_TransferCourtLOVGrid.logicOn = [TransferCase_TransferCourtLOVGrid.dataBinding];
TransferCase_TransferCourtLOVGrid.logic = function(event)
{
	if ( event.getXPath().indexOf(TransferCase_TransferCourtLOVGrid.dataBinding) == -1 )
	{
		return;
	}
	
	var courtCode = Services.getValue(TransferCase_TransferCourtLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(courtCode) )
	{
		Services.setValue(TransferCase_TransferCourtCode.dataBinding, courtCode);
		Services.setValue(TransferCase_TransferCourtLOVGrid.dataBinding, "");
	}
}

/*********************************************************************************/

function TransferCase_TransferReasonLOVGrid() {};
TransferCase_TransferReasonLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubForms/TransferReason";
TransferCase_TransferReasonLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/TransferReasonList";
TransferCase_TransferReasonLOVGrid.rowXPath = "TransferReason";
TransferCase_TransferReasonLOVGrid.keyXPath = "Code";
TransferCase_TransferReasonLOVGrid.columns = [
	{xpath: "Code"},
	{xpath: "Description", sort: "alphabeticalCaseInsensitive"}
];

TransferCase_TransferReasonLOVGrid.styleURL = "/css/TransferReasonLOVGrid.css";
TransferCase_TransferReasonLOVGrid.destroyOnClose = false;
TransferCase_TransferReasonLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "TransferCase_TransferReasonLOVButton"} ],
		keys: [ { key: Key.F6, element: "TransferCase_TransferReason" } ]
	}
};

/**
 * @author rzxd7g
 * @return "TransferCase_TransferReason"  
 */
TransferCase_TransferReasonLOVGrid.nextFocusedAdaptorId = function() {
	return "TransferCase_TransferReason";
}

TransferCase_TransferReasonLOVGrid.logicOn = [TransferCase_TransferReasonLOVGrid.dataBinding];
TransferCase_TransferReasonLOVGrid.logic = function(event)
{
	if ( event.getXPath().indexOf(TransferCase_TransferReasonLOVGrid.dataBinding) == -1 )
	{
		return;
	}
	
	var transferReason = Services.getValue(TransferCase_TransferReasonLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(transferReason) )
	{
		Services.setValue(TransferCase_TransferReason.dataBinding, transferReason);
		Services.setValue(TransferCase_TransferReasonLOVGrid.dataBinding, "");
	}
}

/*********************************************************************************/

function TransferCase_NewCaseTypeLOVGrid() {};
TransferCase_NewCaseTypeLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubForms/NewCaseType";
TransferCase_NewCaseTypeLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/CaseTypes";
TransferCase_NewCaseTypeLOVGrid.rowXPath = "CaseType";
TransferCase_NewCaseTypeLOVGrid.keyXPath = "Type";
TransferCase_NewCaseTypeLOVGrid.columns = [
	{xpath: "Type"},
	{xpath: "Description"}
];

TransferCase_NewCaseTypeLOVGrid.styleURL = "../common_lov_subforms/CaseTypeLOVGrid.css";
TransferCase_NewCaseTypeLOVGrid.destroyOnClose = false;
TransferCase_NewCaseTypeLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "TransferCase_NewCaseTypeLOVButton"} ],
		keys: [ { key: Key.F6, element: "TransferCase_NewCaseType" } ]
	}
};

/**
 * @author rzxd7g
 * @return "Status_SaveButton"  
 */
TransferCase_NewCaseTypeLOVGrid.nextFocusedAdaptorId = function() {
	return "Status_SaveButton";
}

TransferCase_NewCaseTypeLOVGrid.logicOn = [TransferCase_NewCaseTypeLOVGrid.dataBinding];
TransferCase_NewCaseTypeLOVGrid.logic = function(event)
{
	if ( event.getXPath().indexOf(TransferCase_NewCaseTypeLOVGrid.dataBinding) == -1 )
	{
		return;
	}
	
	var caseType = Services.getValue(TransferCase_NewCaseTypeLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(caseType) )
	{
		Services.setValue(TransferCase_NewCaseType.dataBinding, caseType);
		Services.setValue(TransferCase_NewCaseTypeLOVGrid.dataBinding, "");
	}
}

/********************************** GRIDS *****************************************/

function Header_PartyTypeListGrid() {};
Header_PartyTypeListGrid.tabIndex = 2;
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

/***************************** DATA BINDINGS **************************************/

Header_CaseNumber.dataBinding = XPathConstants.DATA_XPATH + "/CaseNumber";
Header_OwningCourtCode.dataBinding = XPathConstants.DATA_XPATH + "/OwningCourtCode";
Header_OwningCourtName.dataBinding = XPathConstants.DATA_XPATH + "/OwningCourtName";
Header_CaseType.dataBinding = XPathConstants.DATA_XPATH + "/CaseType";
Header_CaseStatus.dataBinding = XPathConstants.DATA_XPATH + "/CaseStatus";
TransferCase_TransferCourtCode.dataBinding = XPathConstants.DATA_XPATH + "/TransferCourtCode";
TransferCase_TransferCourtName.dataBinding = XPathConstants.DATA_XPATH + "/TransferCourtName";
TransferCase_TransferReason.dataBinding = XPathConstants.DATA_XPATH + "/TransferReason";
TransferCase_TransferRequestDate.dataBinding = XPathConstants.DATA_XPATH + "/TransferReceiptDate";
TransferCase_TransferStatus.dataBinding = XPathConstants.DATA_XPATH + "/TransferStatus";
TransferCase_NewCaseType.dataBinding = XPathConstants.DATA_XPATH + "/NewCaseType";
TransferCase_ProduceNotice.dataBinding = XPathConstants.DATA_XPATH + "/ProduceNotice";

/********************************* FIELDS ******************************************/

function Header_CaseNumber() {}
Header_CaseNumber.tabIndex = -1;
Header_CaseNumber.maxLength = 8;
Header_CaseNumber.helpText = "Unique identifier of a case quoted by all parties";
Header_CaseNumber.isTemporary = function() { return true; }
Header_CaseNumber.isReadOnly = function() { return true; }

/**
 * @param dom
 * @param serviceName
 * @author rzxd7g
 * 
 */
Header_CaseNumber.onSuccess = function(dom, serviceName)
{
	if ( serviceName == "completeTransferCase" )
	{
		// HANDLING CALL TO COMPLETE TRANSFER
		// Reset the complete transfer parameter and retrieve data
		// Also set foreign case parameter so don't get warning when return to Events screen.
		Services.setValue(TransferCaseParams.COMPLETE_TRANSFER_IND, "");
		Services.setValue(CaseManFormParameters.CASEDATA_OWNINGCOURTWARNING_XPATH, "true");
		retrieveCaseData();
	}
	else if ( serviceName == "getTransferCase" )
	{
		// HANDLING CALL TO RETRIEVE CASE DATA
		// Put case data into the DOM
		Services.startTransaction();
		Services.replaceNode(XPathConstants.DATA_XPATH, dom);
		
		// Set the parties to be displayed in the header grid
		var caseType = Services.getValue(Header_CaseType.dataBinding);
		CaseManUtils.setPartiesForHeaderGrid(caseType, XPathConstants.DATA_XPATH + "/Parties/Party", "PartyRoleCode");
		
		// Set case pending transfer indicator in the DOM
		var transferToCode = Services.getValue(TransferCase_TransferCourtCode.dataBinding);
		var transferStatus = Services.getValue(TransferCase_TransferStatus.dataBinding);
		var pendingTransferValue = ( CaseManUtils.isBlank(transferToCode) ) ? "false" : "true";
		
		if ( pendingTransferValue == "false" || ( pendingTransferValue == "true" && transferStatus == "1" ) )
		{
			// Set focus in the code field
			Services.setFocus("TransferCase_TransferCourtCode");
		}
		
		Services.setValue(XPathConstants.CASEPENDINGTRANSFER_XPATH, pendingTransferValue);
		Services.endTransaction();
		
		// New logic for Trac 4692 - force user to complete or reset transfer if enter screen and case is pending transfer
		if ( pendingTransferValue == "true" && transferStatus == "1" )
		{
			if ( confirm(Messages.TRANSFER_PENDING_CONFIRM) )
			{
				var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
				var params = new ServiceParams();
				params.addSimpleParameter("caseNumber", caseNumber);
				Services.callService("completeTransferCase", params, Header_CaseNumber, true);
			}
			else
			{
				// User wishes to cancel the transfer
				callCommitService("cancelTransferCase");
			}
		}
	}
}

/*********************************************************************************/

function Header_OwningCourtCode() {}
Header_OwningCourtCode.tabIndex = -1;
Header_OwningCourtCode.maxLength = 3;
Header_OwningCourtCode.helpText = "Current owning court code";
Header_OwningCourtCode.isTemporary = function() { return true; }
Header_OwningCourtCode.isReadOnly = function() { return true; }

/*********************************************************************************/

function Header_OwningCourtName() {}
Header_OwningCourtName.tabIndex = -1;
Header_OwningCourtName.maxLength = 70;
Header_OwningCourtName.helpText = "Current owning court name";
Header_OwningCourtName.isTemporary = function() { return true; }
Header_OwningCourtName.isReadOnly = function() { return true; }

/*********************************************************************************/

function Header_CaseType() {}
Header_CaseType.tabIndex = -1;
Header_CaseType.maxLength = 70;
Header_CaseType.helpText = "Current case type";
Header_CaseType.isTemporary = function() { return true; }
Header_CaseType.isReadOnly = function() { return true; }

/*********************************************************************************/

function Header_CaseStatus() {}
Header_CaseStatus.tabIndex = -1;
Header_CaseStatus.maxLength = 70;
Header_CaseStatus.helpText = "Current case status";
Header_CaseStatus.isTemporary = function() { return true; }
Header_CaseStatus.isReadOnly = function() { return true; }

/*********************************************************************************/

function TransferCase_TransferCourtCode() {}
TransferCase_TransferCourtCode.tabIndex = 10;
TransferCase_TransferCourtCode.maxLength = 3;
TransferCase_TransferCourtCode.helpText = "Transfer Court Code";
TransferCase_TransferCourtCode.componentName = "Transfer Court Code";

TransferCase_TransferCourtCode.mandatoryOn = [XPathConstants.CASEPENDINGTRANSFER_XPATH];
TransferCase_TransferCourtCode.isMandatory = function()
{
	return !isCasePendingTransfer();
}


/**
 * This field is read only if the case has been transferred to a Legacy Court (i.e. transfer
 * status of 2).  The only execptions are when a complex case has been transferred to legacy or
 * a CCBC case has been transferred erroneously to legacy and needs to be cancelled.
 * Note - a Transferred CCBC Case can only be transferred back by a CCBC Manager role.
 */
TransferCase_TransferCourtCode.readOnlyOn = [TransferCase_TransferStatus.dataBinding];
TransferCase_TransferCourtCode.isReadOnly = function()
{
	var isFieldReadOnly = false;
	var statusCode = Services.getValue(TransferCase_TransferStatus.dataBinding);
	if ( statusCode == "2" )
	{
		var currentUserRole = Services.getValue(CaseManFormParameters.SECURITYROLE_XPATH);
		if ( !isComplexCase() && !( isTransferredCCBCCase() && currentUserRole == "ccbcMan" ) )
		{
			// Case is not complex and is not a transferred CCBC Case
			isFieldReadOnly = true;
		}
	}
	return isFieldReadOnly;
}

TransferCase_TransferCourtCode.validate = function()
{
	var ec = null;
	var courtExists = Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + TransferCase_TransferCourtCode.dataBinding + "]");
	
	if( !courtExists )
	{
		// The entered court code does not exist
		ec = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	else
	{
		var caseStatus = Services.getValue(Header_CaseStatus.dataBinding);
		switch (caseStatus)
		{
			// Case cannot be transferred for certain case statuses
			case "PAID":
				ec = ErrorCode.getErrorCode("CaseMan_transferCase_casePaid_Msg");
				break;
			case "DISCONTINUED":
				ec = ErrorCode.getErrorCode("CaseMan_transferCase_caseDiscontinued_Msg");
				break;
			case "SETTLED":
				ec = ErrorCode.getErrorCode("CaseMan_transferCase_caseSettled_Msg");
				break;
			case "WITHDRAWN":
				ec = ErrorCode.getErrorCode("CaseMan_transferCase_caseWithdrawn_Msg");
				break;
			case "SETTLED/WDRN":
				ec = ErrorCode.getErrorCode("CaseMan_transferCase_caseSettledWithdrawn_Msg");
				break;
		}
		
		var transferTo = Services.getValue(TransferCase_TransferCourtCode.dataBinding);
		var currentUserRole = Services.getValue(CaseManFormParameters.SECURITYROLE_XPATH);
		if ( null == ec && transferTo == CaseManUtils.CCBC_COURT_CODE && currentUserRole != "ccbcMan" )
		{
			// Only a CCBC Manager may transfer a case back to CCBC.
			ec = ErrorCode.getErrorCode("CaseMan_transferCase_transferToCCBC_Msg");
		}
		
		var isSUPSCourt = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + TransferCase_TransferCourtCode.dataBinding + "]/SUPSCourt");
		if ( isSUPSCourt == "N" )
		{
			var caseType = Services.getValue(Header_CaseType.dataBinding);
			if ( null == ec && CaseManUtils.isInsolvencyCase(caseType) )
			{
				// Cannot transfer to Legacy as is Insolvency Case not supported by Legacy
				ec = ErrorCode.getErrorCode("CaseMan_transferCase_insolvencyToLegacy_Msg");
			}
		}
		
		if ( null == ec && !isCasePendingTransfer() )
		{
			var currentCourtCode = Services.getValue(Header_OwningCourtCode.dataBinding);
			if ( currentCourtCode == transferTo )
			{
				// Changing Court to Own Court
				var isCourtDR = Services.getValue(XPathConstants.DATA_XPATH + "/OwningCourtIsDR");
				var caseTypeJurisdiction = Services.getValue(XPathConstants.DATA_XPATH + "/CaseTypeJurisdiction");
				
				if ( isCourtDR == "N" && caseTypeJurisdiction == JurisdictionTypeCodes.COUNTY_COURT )
				{
					// Transfer to own court is prevented
					ec = ErrorCode.getErrorCode("CaseMan_transferCase_cannotTransferToOwnCourt_Msg");
				}
			}
		}
	}
	return ec;
}

TransferCase_TransferCourtCode.logicOn = [TransferCase_TransferCourtCode.dataBinding];
TransferCase_TransferCourtCode.logic = function(event)
{
	if (event.getXPath() != TransferCase_TransferCourtCode.dataBinding)
	{
		return;
	}
	
	var courtCode = Services.getValue(TransferCase_TransferCourtCode.dataBinding);
	if ( !CaseManUtils.isBlank( courtCode ) )
	{
		// Check if case is pending transfer
		if ( isCasePendingTransfer() )
		{
			// CASE IS PENDING TRANSFER
			var originalCourtCode = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Name = " + TransferCase_TransferCourtName.dataBinding + "]/Code");
			if ( courtCode != originalCourtCode )
			{
				// Warn user that transfer to court cannot be changed and revert value back to original
				alert(Messages.WARNING_TRANSFERPENDING_MESSAGE);
				Services.setValue(TransferCase_TransferCourtCode.dataBinding, originalCourtCode);
			}
		}
		else
		{
			// CASE IS NOT PENDING TRANSFER
			// Populate the Court Name field and any dependant fields with default data.
			Services.startTransaction();
			var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + TransferCase_TransferCourtCode.dataBinding + "]/Name");
			if ( !CaseManUtils.isBlank(courtName) && Services.getValue(TransferCase_TransferCourtName.dataBinding) != courtName )
			{
				Services.setValue(TransferCase_TransferCourtName.dataBinding, courtName);
			}
			Services.setValue(TransferCase_TransferReason.dataBinding, "");
			Services.setValue(TransferCase_TransferRequestDate.dataBinding, CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
			Services.setValue(XPathConstants.DATEOFTRANSFER_XPATH, CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
			Services.setValue(TransferCase_TransferStatus.dataBinding, 1);	// Sets Transfer Status to TO BE TRANSFERRED
			Services.setValue(TransferCase_NewCaseType.dataBinding, "");
			Services.setValue(TransferCase_ProduceNotice.dataBinding, "true");	// Sets Produce Transfer Notice flag
			Services.endTransaction();
			
			// Determine the Jurisdiction for the service to retrieve case types
			var jurisdiction = "";
			var currentCourtCode = Services.getValue(Header_OwningCourtCode.dataBinding);
			if ( currentCourtCode == courtCode )
			{
				// Changing Court to Own Court
				var isCourtDR = Services.getValue(XPathConstants.DATA_XPATH + "/OwningCourtIsDR");
				var caseTypeJurisdiction = Services.getValue(XPathConstants.DATA_XPATH + "/CaseTypeJurisdiction");
				
				if ( isCourtDR == "Y" && caseTypeJurisdiction == JurisdictionTypeCodes.HIGH_COURT )
				{
					// DR Court with High Court Case Type, jurisdiction change to County Court
					jurisdiction = JurisdictionTypeCodes.COUNTY_COURT;
				}
				else if ( isCourtDR == "Y" && caseTypeJurisdiction == JurisdictionTypeCodes.COUNTY_COURT )
				{
					// DR Court with County Court Case Type, jurisdiction change to High Court
					jurisdiction = JurisdictionTypeCodes.HIGH_COURT;
				}
				else if ( isCourtDR == "N" && caseTypeJurisdiction == JurisdictionTypeCodes.HIGH_COURT )
				{
					// CC Court, jurisdiction is optional change to County Court
					jurisdiction = JurisdictionTypeCodes.COUNTY_COURT;
				}
				else
				{
					// For all other cases, set jurisdiction to high court - may not be correct
					jurisdiction = JurisdictionTypeCodes.HIGH_COURT;
				}
			}
			else
			{
				// Transferring to a different court, jurisdiction is type of new court
				var newCourtIsDR = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + TransferCase_TransferCourtCode.dataBinding + "]/CourtIsDR");
				jurisdiction = ( newCourtIsDR == "Y" ) ? JurisdictionTypeCodes.HIGH_COURT : JurisdictionTypeCodes.COUNTY_COURT;
			}

			// Call service to retrieve case types
			var params = new ServiceParams();
			params.addSimpleParameter("jurisdiction", jurisdiction);
			Services.callService("getJurisdictionCaseTypeList", params, TransferCase_TransferCourtCode, true);
		}
	}
	else
	{
		// Check if case is pending transfer
		if ( isCasePendingTransfer() )
		{
			if ( confirm(Messages.CONFIRM_CANCELTRANSFER_MESSAGE) )
			{
				// User wishes to cancel the transfer, clear the fields and call the save service
				clearTransferData();
				
				// Call cancel transfer service if transfer to code has been blanked
				callCommitService("cancelTransferCase");
			}
			else
			{
				// User aborts the cancel, return Transfer To code back to original value
				var originalCourtCode = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Name = " + TransferCase_TransferCourtName.dataBinding + "]/Code");
				Services.setValue(TransferCase_TransferCourtCode.dataBinding, originalCourtCode);
			}
		}
		else
		{
			clearTransferData();
		}
	}
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
TransferCase_TransferCourtCode.onSuccess = function(dom)
{
	Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/CaseTypes", dom);
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
TransferCase_TransferCourtCode.onError = function(exception)
{
	
}

/*********************************************************************************/

function TransferCase_TransferCourtName() {}
TransferCase_TransferCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
TransferCase_TransferCourtName.rowXPath = "Court";
TransferCase_TransferCourtName.keyXPath = "Name";
TransferCase_TransferCourtName.displayXPath = "Name";
TransferCase_TransferCourtName.strictValidation = true;
TransferCase_TransferCourtName.tabIndex = 11;
TransferCase_TransferCourtName.helpText = "Transfer Court Name";
TransferCase_TransferCourtName.componentName = "Transfer Court Name";
TransferCase_TransferCourtName.readOnlyOn = [XPathConstants.CASEPENDINGTRANSFER_XPATH];
TransferCase_TransferCourtName.isReadOnly = isCasePendingTransfer;
TransferCase_TransferCourtName.mandatoryOn = [XPathConstants.CASEPENDINGTRANSFER_XPATH];
TransferCase_TransferCourtName.isMandatory = function()
{
	return !isCasePendingTransfer();
}

TransferCase_TransferCourtName.logicOn = [TransferCase_TransferCourtName.dataBinding];
TransferCase_TransferCourtName.logic = function(event)
{
	if (event.getXPath() != TransferCase_TransferCourtName.dataBinding)
	{
		return;
	}

	var courtName = Services.getValue(TransferCase_TransferCourtName.dataBinding);
	if ( !CaseManUtils.isBlank( courtName ) )
	{
		// Populate the Court Code field
		var courtCode = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Name = " + TransferCase_TransferCourtName.dataBinding + "]/Code");
		if ( !CaseManUtils.isBlank(courtCode) && Services.getValue(TransferCase_TransferCourtCode.dataBinding) != courtCode )
		{
			Services.setValue(TransferCase_TransferCourtCode.dataBinding, courtCode);
		}
	}
	else
	{
		// Court Name cleared so clear the Court Code field
		Services.setValue(TransferCase_TransferCourtCode.dataBinding, "");
	}
}

/*********************************************************************************/

function TransferCase_TransferReason() {}
TransferCase_TransferReason.srcData = XPathConstants.REF_DATA_XPATH + "/TransferReasonList";
TransferCase_TransferReason.rowXPath = "TransferReason";
TransferCase_TransferReason.keyXPath = "Code";
TransferCase_TransferReason.displayXPath = "Description";
TransferCase_TransferReason.strictValidation = true;
TransferCase_TransferReason.tabIndex = 13;
TransferCase_TransferReason.helpText = "Reason for Transfer";
TransferCase_TransferReason.componentName = "Reason for Transfer";
TransferCase_TransferReason.readOnlyOn = [XPathConstants.CASEPENDINGTRANSFER_XPATH];
TransferCase_TransferReason.isReadOnly = isCasePendingTransfer;
TransferCase_TransferReason.enableOn = [TransferCase_TransferCourtCode.dataBinding];
TransferCase_TransferReason.isEnabled = function()
{
	var court = Services.getValue(TransferCase_TransferCourtCode.dataBinding);
	if ( CaseManUtils.isBlank(court) || !Services.getAdaptorById("TransferCase_TransferCourtCode").getValid() )
	{
		// Either court code not entered or court code is invalid
		return false;
	}
	return true;
}

TransferCase_TransferReason.mandatoryOn = [XPathConstants.CASEPENDINGTRANSFER_XPATH];
TransferCase_TransferReason.isMandatory = function()
{
	return !isCasePendingTransfer();
}

/*********************************************************************************/

function TransferCase_TransferRequestDate() {}

TransferCase_TransferRequestDate.tabIndex = 15;
TransferCase_TransferRequestDate.helpText = "Date when transfer request received by court";
TransferCase_TransferRequestDate.componentName = "Transfer Request Date";
TransferCase_TransferRequestDate.readOnlyOn = [XPathConstants.CASEPENDINGTRANSFER_XPATH];
TransferCase_TransferRequestDate.isReadOnly = isCasePendingTransfer;
TransferCase_TransferRequestDate.enableOn = [TransferCase_TransferCourtCode.dataBinding];
TransferCase_TransferRequestDate.isEnabled = function()
{
	var court = Services.getValue(TransferCase_TransferCourtCode.dataBinding);
	if ( CaseManUtils.isBlank(court) || !Services.getAdaptorById("TransferCase_TransferCourtCode").getValid() )
	{
		// Either court code not entered or court code is invalid
		return false;
	}
	return true;
}

TransferCase_TransferRequestDate.mandatoryOn = [XPathConstants.CASEPENDINGTRANSFER_XPATH];
TransferCase_TransferRequestDate.isMandatory = function()
{
	return !isCasePendingTransfer();
}

TransferCase_TransferRequestDate.validate = function()
{
	var ec = null;
	var dateReceived = Services.getValue(TransferCase_TransferRequestDate.dataBinding);

	if ( !CaseManUtils.isBlank(dateReceived) )
	{
		dateReceived = CaseManUtils.createDate( dateReceived );
		var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
		var monthAgo = CaseManUtils.oneMonthEarlier(today);
		
		if ( CaseManUtils.compareDates(today, dateReceived) == 1 )
		{
			// The date entered is in future
			ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
		}
		
		// Check if date is more than 1 month in the past, if so give warning
		// UCT Defect 689 - only display message if the case is NOT awaiting transfer.
		if ( !isCasePendingTransfer() && CaseManUtils.compareDates(monthAgo, dateReceived) == -1 )
		{
			alert(Messages.DATEOVER1MONTH_MESSAGE);
		}
	}

	return ec;
}

/*********************************************************************************/

function TransferCase_TransferStatus() {}
TransferCase_TransferStatus.tabIndex = -1;
TransferCase_TransferStatus.maxLength = 30;
TransferCase_TransferStatus.helpText = "The transfer status of the case.";
TransferCase_TransferStatus.componentName = "Transfer Status";
TransferCase_TransferStatus.isReadOnly = function() { return true; }
TransferCase_TransferStatus.enableOn = [TransferCase_TransferCourtCode.dataBinding];
TransferCase_TransferStatus.isEnabled = function()
{
	var court = Services.getValue(TransferCase_TransferCourtCode.dataBinding);
	if ( CaseManUtils.isBlank(court) || !Services.getAdaptorById("TransferCase_TransferCourtCode").getValid() )
	{
		// Either court code not entered or court code is invalid
		return false;
	}
	return true;
}

TransferCase_TransferStatus.transformToDisplay = function(value)
{
	// Convert single digit value in model to text description on screen
	var displayValue = "";
	
	switch (value)
	{
		case "0":
			displayValue = TransferCaseStatusDescriptions.TRANSFERRED_MAN;
			break;
			
		case "1":
			displayValue = TransferCaseStatusDescriptions.TOBE_TRANSFERRED;
			break;
		
		case "2":
			displayValue = TransferCaseStatusDescriptions.TRANSFERRED_ELECT;
			break;
	}
	
	return displayValue
}

/*********************************************************************************/

function TransferCase_NewCaseType() {}
TransferCase_NewCaseType.srcData = XPathConstants.REF_DATA_XPATH + "/CaseTypes";
TransferCase_NewCaseType.rowXPath = "CaseType";
TransferCase_NewCaseType.keyXPath = "Type";
TransferCase_NewCaseType.displayXPath = "Type";
TransferCase_NewCaseType.strictValidation = false;
TransferCase_NewCaseType.tabIndex = 16;
TransferCase_NewCaseType.helpText = "New Case Type";
TransferCase_NewCaseType.componentName = "New Case Type";
TransferCase_NewCaseType.readOnlyOn = [XPathConstants.CASEPENDINGTRANSFER_XPATH];
TransferCase_NewCaseType.isReadOnly = isCasePendingTransfer;
TransferCase_NewCaseType.validateOn = [XPathConstants.CASEPENDINGTRANSFER_XPATH];
TransferCase_NewCaseType.validate = function()
{
	if ( isCasePendingTransfer() )
	{
		return null;
	}

	var value = Services.getValue(TransferCase_NewCaseType.dataBinding);
	if ( !CaseManUtils.isBlank(value) && !Services.exists(XPathConstants.REF_DATA_XPATH + "/CaseTypes/CaseType[./Type = " + TransferCase_NewCaseType.dataBinding + "]") )
	{
		var ec = ErrorCode.getErrorCode('InvalidFieldLength');
		ec.m_message = "Field value not in source data";
		return ec;
	}
	return null;
}

TransferCase_NewCaseType.enableOn = [TransferCase_TransferCourtCode.dataBinding];
TransferCase_NewCaseType.isEnabled = function()
{
	var court = Services.getValue(TransferCase_TransferCourtCode.dataBinding);
	if ( CaseManUtils.isBlank(court) || !Services.getAdaptorById("TransferCase_TransferCourtCode").getValid() )
	{
		// Either court code not entered or court code is invalid
		return false;
	}
	
	var jurisdiction = Services.getValue(XPathConstants.DATA_XPATH + "/Jurisdiction");
	var caseType = Services.getValue(Header_CaseType.dataBinding);
	if ( CaseManUtils.isInsolvencyCase(caseType) || jurisdiction == "F" )
	{
		// Disabled if the case is insolvency or family enforcement
		return false;
	}
	return true;
}

TransferCase_NewCaseType.mandatoryOn = [TransferCase_TransferCourtCode.dataBinding, XPathConstants.CASEPENDINGTRANSFER_XPATH];
TransferCase_NewCaseType.isMandatory = function()
{
	var blnMandatory = false;

	// Only test the jurisdiction change if not pending transfer
	if ( !isCasePendingTransfer() )
	{
		// Get Current Court and New Court Data
		var newCourtCode = Services.getValue(TransferCase_TransferCourtCode.dataBinding);
		if ( !CaseManUtils.isBlank(newCourtCode) )
		{
			// Only test the rules if Transfer To has a value
			var currentCourtCode = Services.getValue(Header_OwningCourtCode.dataBinding);
			if ( currentCourtCode == newCourtCode )
			{
				// Changing Court to Own Court
				blnMandatory = true;
			}
			else
			{
				var caseTypeJurisdiction = Services.getValue(XPathConstants.DATA_XPATH + "/CaseTypeJurisdiction");
				var isCurrentCaseTypeDR = (caseTypeJurisdiction == JurisdictionTypeCodes.HIGH_COURT) ? "Y" : "N";
				var isNewCourtDR = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + TransferCase_TransferCourtCode.dataBinding + "]/CourtIsDR");
			
				// Transferring to a different court
				if ( isCurrentCaseTypeDR == "Y" && isNewCourtDR == "N" )
				{
					// Case with DR case type transferring to a CC court, enforce the change in Case Type
					blnMandatory = true;
				}
			}
		}
	}
	return blnMandatory;
}

/**********************************************************************************/

function TransferCase_ProduceNotice() {}
TransferCase_ProduceNotice.modelValue = {checked: 'true', unchecked: 'false'};
TransferCase_ProduceNotice.tabIndex = 18;
TransferCase_ProduceNotice.isTemporary = function() { return true; }
TransferCase_ProduceNotice.helpText = "Uncheck checkbox if no output required";
TransferCase_ProduceNotice.enableOn = [TransferCase_TransferCourtCode.dataBinding, XPathConstants.CASEPENDINGTRANSFER_XPATH];
TransferCase_ProduceNotice.isEnabled = function()
{
	var blnEnabled = true;
	var court = Services.getValue(TransferCase_TransferCourtCode.dataBinding);
	if ( CaseManUtils.isBlank(court) || !Services.getAdaptorById("TransferCase_TransferCourtCode").getValid() )
	{
		// Either court code not entered or court code is invalid
		blnEnabled = false;
	}
	else if ( isCasePendingTransfer() )
	{
		// Disabled if Case is pending transfer
		blnEnabled = false;
	}
	return blnEnabled;
}

/******************************** BUTTONS *****************************************/

function TransferCase_TransferCourtLOVButton() {}
TransferCase_TransferCourtLOVButton.tabIndex = 12;
TransferCase_TransferCourtLOVButton.enableOn = [XPathConstants.CASEPENDINGTRANSFER_XPATH];
TransferCase_TransferCourtLOVButton.isEnabled = function()
{
	return !isCasePendingTransfer();
}

/**********************************************************************************/

function TransferCase_TransferReasonLOVButton() {}
TransferCase_TransferReasonLOVButton.tabIndex = 14;
TransferCase_TransferReasonLOVButton.enableOn = [TransferCase_TransferCourtCode.dataBinding, XPathConstants.CASEPENDINGTRANSFER_XPATH];
TransferCase_TransferReasonLOVButton.isEnabled = function()
{
	var court = Services.getValue(TransferCase_TransferCourtCode.dataBinding);
	if ( CaseManUtils.isBlank(court) || !Services.getAdaptorById("TransferCase_TransferCourtCode").getValid() )
	{
		// Either court code not entered or court code is invalid
		return false;
	}
	if ( isCasePendingTransfer() )
	{
		return false;
	}
	return true;
}

/**********************************************************************************/

function TransferCase_NewCaseTypeLOVButton() {}
TransferCase_NewCaseTypeLOVButton.tabIndex = 17;
TransferCase_NewCaseTypeLOVButton.enableOn = [TransferCase_TransferCourtCode.dataBinding, XPathConstants.CASEPENDINGTRANSFER_XPATH];
TransferCase_NewCaseTypeLOVButton.isEnabled = function()
{
	var court = Services.getValue(TransferCase_TransferCourtCode.dataBinding);
	if ( CaseManUtils.isBlank(court) || !Services.getAdaptorById("TransferCase_TransferCourtCode").getValid() )
	{
		// Either court code not entered or court code is invalid
		return false;
	}
	if ( isCasePendingTransfer() )
	{
		return false;
	}
	
	var jurisdiction = Services.getValue(XPathConstants.DATA_XPATH + "/Jurisdiction");
	var caseType = Services.getValue(Header_CaseType.dataBinding);
	if ( CaseManUtils.isInsolvencyCase(caseType) || jurisdiction == "F" )
	{
		// Disabled if the case is insolvency or family enforcement
		return false;
	}
	return true;
}

/**********************************************************************************/

function Status_SaveButton() {}
Status_SaveButton.tabIndex = 20;
Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "transferCase" } ]
	}
};
/**
 * @author rzxd7g
 * @return null 
 */
Status_SaveButton.actionBinding = function()
{
	// Validate the form
	var invalidFields = FormController.getInstance().validateForm(true, true);
	if (0 != invalidFields.length)
	{
		return;
	}
	
	if ( !isCasePendingTransfer() && confirm(Messages.CONFIRM_AUTOMATICTRANSFER_MESSAGE) )
	{
		// Normal transfer, Call the Start Transfer Process service
		callCommitService("startTransferCase");			
	}
};

/**
 * @param dom
 * @param serviceName
 * @author rzxd7g
 * @return to this screen. 
 */
Status_SaveButton.onSuccess = function(dom, serviceName)
{
	if ( serviceName == "startTransferCase" )
	{
		// HANDLE START TRANSFER CASE RETURN DOM
		Services.startTransaction();
		Services.replaceNode(XPathConstants.NAVIGATION_DATA_XPATH, dom);
		
		var ProduceNotice = Services.getValue(TransferCase_ProduceNotice.dataBinding);
		if ( ProduceNotice == "false" )
		{
			// No output to be produced, call complete transfer service
			var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
			var params = new ServiceParams();
			params.addSimpleParameter("caseNumber", caseNumber);
			Services.callService("completeTransferCase", params, Status_SaveButton, true);		
		}
		else
		{
			// Output being produced, complete transfer on return to the screen.
			Services.setValue(TransferCaseParams.COMPLETE_TRANSFER_IND, "true");
			handlePostTransferNavigation();
		}
	}
	else if ( serviceName == "completeTransferCase" )
	{
		// Set foreign case parameter so don't get warning when return to Events screen.
		Services.setValue(CaseManFormParameters.CASEDATA_OWNINGCOURTWARNING_XPATH, "true");
		handlePostTransferNavigation();
	}
	else if ( serviceName == "cancelTransferCase" )
	{
		// HANDLE START TRANSFER CASE RETURN DOM
		retrieveCaseData();
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
		retrieveCaseData();
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

/**********************************************************************************/

function Status_CloseButton() {}
Status_CloseButton.tabIndex = 21;
Status_CloseButton.actionBinding = function()
{
	var transCourtCode = Services.getValue(TransferCase_TransferCourtCode.dataBinding);
	var transCourtName = Services.getValue(TransferCase_TransferCourtName.dataBinding);
	if ( ( !CaseManUtils.isBlank(transCourtCode) || !CaseManUtils.isBlank(transCourtName) )
		 && !isCasePendingTransfer() 
		 && confirm(Messages.DETSLOST_MESSAGE) )
	{
		// UCT Defect 690 - Introduction of the Unsaved Changes Warning Message
		Status_SaveButton.actionBinding();
	}
	else
	{
		exitScreen();
	}
}
Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "transferCase" } ]
	}
};
