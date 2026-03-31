/** 
 * @fileoverview Audit_SubForm.js:
 * This file contains the configurations for the Audit Subform
 *
 * @author Chris Vincent
 */
 
/**
 * Audit Constants
 * @author rzxd7g
 * 
 */
function AuditConstants() {};
AuditConstants.AUDIT_DATA_XPATH = "/ds/var/form/AuditData"
AuditConstants.AUDIT_KEYS_XPATH = AuditConstants.AUDIT_DATA_XPATH + "/Tables";
AuditConstants.AUDIT_PAGENUMBER_XPATH = AuditConstants.AUDIT_DATA_XPATH + "/PageNumber";
AuditConstants.DATA_XPATH = "/ds/AuditList";
AuditConstants.PAGE_SIZE = 50;

/**************************** HELPER FUNCTIONS **************************************/

/**
 * @author rzxd7g
 * 
 */
function loadAuditData()
{
	var pageNumber = Services.getValue(AuditConstants.AUDIT_PAGENUMBER_XPATH);
	var tablesNode = XML.createDOM(null, null, null);
	tablesNode.appendChild( Services.getNode(AuditConstants.AUDIT_KEYS_XPATH) );

	var params = new ServiceParams();
	params.addSimpleParameter("pageNumber", pageNumber );
	params.addSimpleParameter("pageSize", AuditConstants.PAGE_SIZE );
	params.addDOMParameter("auditKeys", tablesNode );
	Services.callService("getAuditData", params, auditSubform, true);
}

/************************** FORM CONFIGURATIONS *************************************/

function auditSubform() {}

/**
 * @author rzxd7g
 * 
 */
auditSubform.initialise = function()
{
	// Set the default page number when launch the subform
	Services.setValue(AuditConstants.AUDIT_PAGENUMBER_XPATH, 1);
	loadAuditData();
}

auditSubform.cancelLifeCycle = {

	eventBinding: {	keys: [ { key: Key.F4, element: "auditSubform" } ],
					singleClicks: [ {element: "AuditPopup_CloseButton"} ],
					doubleClicks: []
				  }
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
auditSubform.onSuccess = function(dom)
{
	var dataNode = dom.selectSingleNode(AuditConstants.DATA_XPATH);
	Services.replaceNode(AuditConstants.DATA_XPATH, dataNode);
}

/********************************* GRIDS *******************************************/

/**
 * Audit Data Change History Grid
 * @author rzxd7g
 * 
 */
function Audit_DataChangeGrid() {};
Audit_DataChangeGrid.dataBinding = "/ds/var/page/SelectedGridRow/AuditRow";
Audit_DataChangeGrid.tabIndex = 1;
Audit_DataChangeGrid.srcData = AuditConstants.DATA_XPATH;
Audit_DataChangeGrid.rowXPath = "Audit";
Audit_DataChangeGrid.keyXPath = "id";
Audit_DataChangeGrid.columns = [
	{xpath: "Date", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "Column"},
	{xpath: "OldValue"},
	{xpath: "UserName"},
	{xpath: "Comment"}
];

/****************************** BUTTON FIELDS **************************************/

/**
 * Audit Popup Previous Set of Records Button
 * @author rzxd7g
 * 
 */
function AuditPopup_PreviousButton() {}
AuditPopup_PreviousButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_P, element: "auditSubform", alt: true } ]
	}
};
AuditPopup_PreviousButton.tabIndex = 10;

AuditPopup_PreviousButton.enableOn = [AuditConstants.AUDIT_PAGENUMBER_XPATH];
AuditPopup_PreviousButton.isEnabled = function(event)
{
	// Disable Previous button if on first page
	var pageNumber = parseInt(Services.getValue(AuditConstants.AUDIT_PAGENUMBER_XPATH));
	if ( pageNumber == 1 )
	{
		return false;
	}
	return true;
}

/**
 * @author rzxd7g
 * 
 */
AuditPopup_PreviousButton.actionBinding = function()
{
	// Decrement the page number
	var pageNumber = parseInt(Services.getValue(AuditConstants.AUDIT_PAGENUMBER_XPATH));
	Services.setValue( AuditConstants.AUDIT_PAGENUMBER_XPATH, (pageNumber - 1) );
	
	// Invoke the audit service
	loadAuditData();
}

/**********************************************************************************/

/**
 * Audit Popup Next Set of Records Button
 * @author rzxd7g
 * 
 */
function AuditPopup_NextButton() {}
AuditPopup_NextButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_N, element: "auditSubform", alt: true } ]
	}
};
AuditPopup_NextButton.tabIndex = 11;

AuditPopup_NextButton.enableOn = [AuditConstants.DATA_XPATH];
AuditPopup_NextButton.isEnabled = function()
{
	var countRecords = Services.countNodes( AuditConstants.DATA_XPATH + "/" + Audit_DataChangeGrid.rowXPath );
	if ( countRecords == AuditConstants.PAGE_SIZE )
	{
		return true;
	}
	return false;
}

/**
 * @author rzxd7g
 * 
 */
AuditPopup_NextButton.actionBinding = function()
{
	// Increment the page number
	var pageNumber = parseInt( Services.getValue(AuditConstants.AUDIT_PAGENUMBER_XPATH) );
	Services.setValue( AuditConstants.AUDIT_PAGENUMBER_XPATH, (pageNumber + 1) );
	
	// Invoke the audit service
	loadAuditData();
}

/**********************************************************************************/

function AuditPopup_CloseButton() {}
AuditPopup_CloseButton.tabIndex = 12;
