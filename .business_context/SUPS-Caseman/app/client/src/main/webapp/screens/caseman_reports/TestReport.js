/*****************************************************************************************************************
                                               MAIN FORM
*****************************************************************************************************************/

function TestReport() {}

var APP_XPATH = "/ds/var/app";
var FORM_XPATH = "/ds/var/form";

// Load the test dom of Report IDs
TestReport.loadModelDataService = {dataBinding:APP_XPATH, fileName:"TestReport.xml"};


/**
 * @author jzthd2
 * 
 */
TestReport.initialise = function()
{
	if (getCookie("adminCC")==null)
	{
		alert("WARNING: Admin Crown Court for user has not been set.\nPlease use the login screen before visiting this page!");
	}

	// Retrieve the list of Reports IDs
	var reportList = Services.getValue(APP_XPATH + "/Reports");

    //The getReportRefData service maps Report Ids to Report Modules

    if (reportList != null && reportList != "")
    {
        var handler = {
    		onSuccess: function(dom)
    		{
    		    if (dom != null)
	            {
                    // Add the results
                    Services.addNode(dom, FORM_XPATH);
                }
    		},
    		onError: function(exception) {
    			FormController.getInstance().setStatusBarMessage(exception.message);
    		}
    	}

	    var params = new ServiceParams();
	    params.addSimpleParameter("reportList", reportList);

		Services.callService("getReportRefData", params, handler, false);
	}
}


/*****************************************************************************************************************
                                            DATA BINDINGS
*****************************************************************************************************************/

// Master Bindings
Master_Reports.dataBinding = FORM_XPATH + "/Master_Reports";
Master_Reports.srcData = FORM_XPATH + "/Reports";
Master_Reports.rowXPath = "Report";
Master_Reports.keyXPath = "SurrogateKey";
Master_Reports.columns = [
	{xpath: "Id"},
	{xpath: "Module"},
	{xpath: "Title"}
];

/*****************************************************************************************************************
                                        INPUT FIELD DEFINITIONS
*****************************************************************************************************************/

/****************************************************************************************************************/

function Master_Reports() {}

Master_Reports.tabIndex = 10;

/****************************************************************************************************************/

function Status_Run() {}

/**
 * @author jzthd2
 * 
 */
Status_Run.actionBinding = function()
{	
	// Create the Report dom
	var reportId = Services.getValue(Master_Reports.srcData + "/" + Master_Reports.rowXPath + "[./" + Master_Reports.keyXPath + " = " + Master_Reports.dataBinding + "]/Id");
	var dom = Reports.createReportDom(reportId);

	if (reportId == "CMBMSALL")
	{
		Reports.setValue(dom, "STARTDATE", "10-JAN-2005");
		Reports.setValue(dom, "ENDDATE", "10-MAR-2005");
		Reports.setValue(dom, "SECTION", "434");
	}
	else if (reportId == "CMOBLR1")
	{
	}
	else if (reportId == "CMWFTR1")
	{
	}
	else if (reportId == "CMWFTR2")
	{
	}
	
	// Generate the report
	Reports.runReport(dom);
}
