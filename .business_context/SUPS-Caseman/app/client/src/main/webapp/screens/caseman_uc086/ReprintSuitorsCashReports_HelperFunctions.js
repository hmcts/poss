/** 
 * @fileoverview ReprintSuitorsCashReports_HelperFunctions.js:
 * This file contains the helper functions for UC086 - Reprint Suitors' Cash Reports screen.
 *
 * @author Chris Vincent
 * @version 0.1
 * 
 * Change History:
 * 21/08/2006 - Chris Vincent, Updated getReports() to add paging parameters
 * 				due to performance issues with the screen (Defect 4458).
 */

/**
 * Function calls the service to return the relevant reports in date order (most recent first).
 * Up to 50 records are returned at a time with a paging solution in place for performance.
 * @author rzxd7g
 * 
 */
function getReports()
{
	var pageNumber = Services.getValue(XPathConstants.PAGENUMBER_XPATH);
	if ( CaseManUtils.isBlank(pageNumber) )
	{
		pageNumber = 1;
		Services.setValue(XPathConstants.PAGENUMBER_XPATH, pageNumber);
	}
	
	var params = new ServiceParams();
	params.addSimpleParameter( "pageSize", CaseManFormParameters.DEFAULT_PAGE_SIZE );
	params.addSimpleParameter( "pageNumber", pageNumber );
	Services.callService( "getReprintList", params, reprintSuitorsCashReports, null );
}

/*********************************************************************************/

/**
 * Function calls the service to reprint the currently selected report 
 * @author rzxd7g
 * 
 */
function reprintReport()
{
	reportId = Services.getValue(ReportsGrid.dataBinding);
	reportName = Services.getValue(XPathConstants.DATA_XPATH + "/SuitorsCashReport[FWReportId='" + reportId + "']/ReportName");
	
	if ( reportName == "Authorisation List" )
	{
		// AE Start of Day, prompt user if want to reprint all the event outputs or just the AUTH_LST
		Services.showDialog( StandardDialogTypes.YES_NO_CANCEL,
							 handleAESODReprint,
							 "Would you like to reprint all the AE Event outputs?<br>" +
							 "Click Yes to reprint all AE Event Outputs as well as the Authorisation List<br>" +
							 "Click No to only reprint the Authorisation List<br>" +
							 "Click Cancel to exit",
							 "AE Start of Day Reprint" );
	}
	else
	{
		var params = new ServiceParams();
		var paramNode = Services.getNode(XPathConstants.DATA_XPATH + "/SuitorsCashReport[FWReportId='" + reportId + "']");
		params.addNodeParameter("ReprintReport", paramNode);
		Services.callService("reprintReport", params, Reports_RunReportButton, null);
	}	 
}

/*********************************************************************************/

/**
 * Handler for the AE Start of Day reprint dialog
 */
function handleAESODReprint(response)
{
	reportId = Services.getValue(ReportsGrid.dataBinding);
	var params = new ServiceParams();
	
	switch (response)
	{
		case StandardDialogButtonTypes.YES:
			// Print AE Start of Day Event Outputs as well as the AUTH_LST
			Services.setValue(XPathConstants.DATA_XPATH + "/SuitorsCashReport[FWReportId='" + reportId + "']/ReprintEvents","true");
			var paramNode = Services.getNode(XPathConstants.DATA_XPATH + "/SuitorsCashReport[FWReportId='" + reportId + "']");
			params.addNodeParameter("ReprintReport", paramNode);
			Reports.callAsync("asyncReprintReport", params, CaseMan_AsyncMonitor.srcData);
			Util.openPopup("CaseMan_AsyncMonitorPopup");
			break;
		
		case StandardDialogButtonTypes.NO:
			// Print only the AUTH_LST
			Services.setValue(XPathConstants.DATA_XPATH + "/SuitorsCashReport[FWReportId='" + reportId + "']/ReprintEvents","false");
			var paramNode = Services.getNode(XPathConstants.DATA_XPATH + "/SuitorsCashReport[FWReportId='" + reportId + "']");
			params.addNodeParameter("ReprintReport", paramNode);
			Services.callService("reprintReport", params, Reports_RunReportButton, null);
			break;
			
		case StandardDialogButtonTypes.CANCEL:
			// No action
			break;
	}
}

/*********************************************************************************/

/**
 * Function handles the exit from the screen, returning to the main menu.
 * @author rzxd7g
 * 
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}
