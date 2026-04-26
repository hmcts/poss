/** 
 * @fileoverview ReprintSuitorsCashReports.js:
 * This file contains the form and field configurations for the UC086 - Reprint Suitors' 
 * Cash Reports screen.
 *
 * @author Chris Vincent
 * @version 0.1
 * 
 * Change History:
 * 21/08/2006 - Chris Vincent, Added paging mechanism to the screen (Previous and Next buttons)
 * 				due to performance issues with the screen (Defect 4458).
 */

/****************************** MAIN FORM *****************************************/

function reprintSuitorsCashReports() {};

/**
 * @author rzxd7g
 * 
 */
reprintSuitorsCashReports.initialise = function()
{
	// Call service to return all reports
	getReports();
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
reprintSuitorsCashReports.onSuccess = function(dom) 
{
	Services.replaceNode(XPathConstants.DATA_XPATH, dom);
	Services.setFocus("ReportsGrid");
}

/********************************** GRIDS *****************************************/

function ReportsGrid() {};
ReportsGrid.tabIndex = 1;
ReportsGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedReport";
ReportsGrid.srcData = XPathConstants.DATA_XPATH;
ReportsGrid.rowXPath = "SuitorsCashReport";
ReportsGrid.keyXPath = "FWReportId";
ReportsGrid.columns = [
	{xpath: "UserName"},
	{xpath: "Alias"},
	{xpath: "ReportId"},
	{xpath: "ReportName"},
	{xpath: "Date", sort: CaseManUtils.sortGridDatesDsc, defaultSort:"true", additionalSortColumns: [ { columnNumber: 5, orderOnAsc: "descending", orderOnDesc: "ascending" } ], transformToDisplay: CaseManUtils.formatGridDate },
	{xpath: "FWReportId"},
	{xpath: "Printed"}
];

ReportsGrid.isEnabled = function()
{
	// Grid is disabled if no reports in the grid
	var gridDB = Services.getValue(ReportsGrid.dataBinding);
	return CaseManUtils.isBlank(gridDB) ? false : true;
}

/******************************** BUTTONS *****************************************/

function Reports_PreviousButton() {}
Reports_PreviousButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_P, element: "reprintSuitorsCashReports", alt: true } ]
	}
};
Reports_PreviousButton.tabIndex = 2;
Reports_PreviousButton.enableOn = [XPathConstants.PAGENUMBER_XPATH];
Reports_PreviousButton.isEnabled = function()
{
	// Disable Previous button if on first page
	var pageNumber = Services.getValue(XPathConstants.PAGENUMBER_XPATH);
	return ( !CaseManUtils.isBlank(pageNumber) && parseInt(pageNumber) > 1 ) ? true : false;
}

/**
 * @author rzxd7g
 * 
 */
Reports_PreviousButton.actionBinding = function()
{
	// Decrement the page number and call retrieval service
	var pageNumber = parseInt(Services.getValue(XPathConstants.PAGENUMBER_XPATH));
	Services.setValue( XPathConstants.PAGENUMBER_XPATH, (pageNumber - 1) );
	getReports();
}

/**********************************************************************************/

function Reports_NextButton() {}
Reports_NextButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_N, element: "reprintSuitorsCashReports", alt: true } ]
	}
};
Reports_NextButton.tabIndex = 3;
Reports_NextButton.enableOn = [ReportsGrid.srcData];
Reports_NextButton.isEnabled = function()
{
	var countRecords = Services.countNodes( ReportsGrid.srcData + "/" + ReportsGrid.rowXPath );
	return ( countRecords == CaseManFormParameters.DEFAULT_PAGE_SIZE ) ? true : false;
}

/**
 * @author rzxd7g
 * 
 */
Reports_NextButton.actionBinding = function()
{
	// Increment the page number and call retrieval service
	var pageNumber = parseInt(Services.getValue(XPathConstants.PAGENUMBER_XPATH));
	Services.setValue( XPathConstants.PAGENUMBER_XPATH, (pageNumber + 1) );
	getReports();
}

/***********************************************************************************/

function Reports_RunReportButton() {};

Reports_RunReportButton.additionalBindings = {
	eventBinding: {
		doubleClicks: [ {element: "ReportsGrid"} ]
	}
};

Reports_RunReportButton.enableOn = [ReportsGrid.dataBinding];
Reports_RunReportButton.isEnabled = function()
{
	// Grid is disabled if no reports in the grid
	var gridDB = Services.getValue(ReportsGrid.dataBinding);
	return CaseManUtils.isBlank(gridDB) ? false : true;
}

Reports_RunReportButton.tabIndex = 4;
Reports_RunReportButton.actionBinding = reprintReport;
/**
 * @param dom
 * @author rzxd7g
 * 
 */
Reports_RunReportButton.onSuccess = function(dom)
{
	// Retrieve the reports again
	//getReports();
}

/***********************************************************************************/

function Status_CloseButton() {};
Status_CloseButton.tabIndex = 10;
Status_CloseButton.actionBinding = exitScreen;
Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "reprintSuitorsCashReports" } ]
	}
};

/***********************************************************************************/

function CaseMan_AsyncMonitorPopup() {};
function CaseMan_AsyncMonitor() {};
CaseMan_AsyncMonitor.srcData = "/ds/var/form/Async";
CaseMan_AsyncMonitor.dataBinding = CaseMan_AsyncMonitor.srcData + "/Id";
CaseMan_AsyncMonitor.asyncStateService = "getState";
CaseMan_AsyncMonitor.asyncCancelService = "cancel";

CaseMan_AsyncMonitor.onComplete = function()
{
	Util.closePopup("CaseMan_AsyncMonitorPopup");
	Services.setTransientStatusBarMessage("Report Completed");
}

CaseMan_AsyncMonitor.onError = function(exception)
{
	var message = "An error occurred running the counter verification report";
	if (exception.message.length > 0) {
		message = exception.message;
	}
	Services.setTransientStatusBarMessage(message);
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}

CaseMan_AsyncMonitor.onCancel = function()
{
	
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}

CaseMan_AsyncMonitor.onCancelError = function(error)
{
    alert("Unable to cancel report: " + error.message);
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}