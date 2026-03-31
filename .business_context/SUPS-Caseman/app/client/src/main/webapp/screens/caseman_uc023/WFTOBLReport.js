/** 
 * @fileoverview WFTOBLReport.js:
 * This file contains the form and field configurations for the UC023 - Diary Monitoring Reports 
 * screen.
 *
 * @author Dave Turner, Chris Vincent
 * @version 0.1
 *
 * Change History:
 * 29/01/2013 - Chris Vincent, new parameters for DMS Daily report added as part of RFS 3719.  Trac 4767 
 */

/****************************** MAIN FORM *****************************************/

function WFTOBLReport() {};

/************************** HELPER FUNCTIONS **************************************/

/**
 * Function handles the exit from the screen
 * @author jzthd2
 * 
 */
function exitScreen()
{
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

/***********************************************************************************/

/**
 * Function handles the running of one of the screen's reports
 * @param [String] reportId The name of the report to run
 * @author jzthd2
 * 
 */
function requestReport(reportId)
{
	var dom = Reports.createReportDom(reportId);
	Reports.runReport(dom);
}

/******************************** BUTTONS *****************************************/

function PRINT_CM_OBL_R1_Btn() {};
PRINT_CM_OBL_R1_Btn.tabIndex = 1;
/**
 * @author jzthd2
 * 
 */
PRINT_CM_OBL_R1_Btn.actionBinding = function()
{
	var dom = Reports.createReportDom("CM_OBL_R1.rdf");
	Reports.setValue(dom, "P_REPORT_START_DATE", "%" );
	Reports.setValue(dom, "P_REPORT_END_DATE", "%" );
	Reports.setValue(dom, "P_REPORT_OBL_TYPE", "%");
	Reports.runReport(dom);
}

/***********************************************************************************/

function PRINT_WFT_R1_Btn() {};
PRINT_WFT_R1_Btn.tabIndex = 2;
/**
 * @author jzthd2
 * 
 */
PRINT_WFT_R1_Btn.actionBinding = function()
{
	requestReport("CM_WFT_R1.rdf");
}

/***********************************************************************************/

function PRINT_WFT_R2_Btn() {};
PRINT_WFT_R2_Btn.tabIndex = 3;
/**
 * @author jzthd2
 * 
 */
PRINT_WFT_R2_Btn.actionBinding = function()
{
	requestReport("CM_WFT_R2.rdf");
}

/***********************************************************************************/

function Status_Close_Btn() {};
Status_Close_Btn.actionBinding = exitScreen;
Status_Close_Btn.tabIndex = 4;
Status_Close_Btn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "WFTOBLReport" } ]
	}
};

/*************************** PROGRESS BAR FIELDS **********************************/

function Progress_Bar() {}
Progress_Bar.tabIndex = -1;
Progress_Bar.dataBinding = "/ds/ProgressBar/Progress";
Progress_Bar.isReadOnly = function() { return true; }	

/***********************************************************************************/

function Popup_Cancel() {};
Popup_Cancel.tabIndex = 10;
Popup_Cancel.cancelled = false;
/**
 * @author jzthd2
 * 
 */
Popup_Cancel.actionBinding = function() 
{
	Popup_Cancel.cancelled = true;
	Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
}
