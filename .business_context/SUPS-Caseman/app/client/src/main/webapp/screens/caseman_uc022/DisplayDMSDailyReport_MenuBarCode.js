/** 
 * @fileoverview DisplayDMSDailyReport_MenuBarCode.js:
 * Configurations for the UC022 (Display DMS Daily Report) Navigation Buttons
 *
 * @author Chris Vincent
 *
 * 04/08/2009 - Chris Vincent, Added navigation buttons for the Cases and the Case Events screen
 *              TRAC Ticket 1186.
 * 29/01/2013 - Chris Vincent, new parameters for screen and report added as part of RFS 3719.  Trac 4767 
 */

menubar = {
	quickLinks: [
		{
			id: "NavBar_PrintDMSDailyReportButton",
			label: "Print",
			formName: NavigationController.MAIN_MENU,
            /**
             * @author rzxd7g
             * @return boolean
             */
			guard: 	function() 
				   	{ 
				   		var dom = Reports.createReportDom("CM_OBL_R1.rdf");
						
						// Validate the start and end date fields - both must be populated and both must be valid 
						var ec = null;
						var startDate = Services.getValue(DMS_Query_StartDate.dataBinding);
						var endDate = Services.getValue(DMS_Query_EndDate.dataBinding);
						if ( CaseManUtils.isBlank(startDate) && !CaseManUtils.isBlank(endDate) )
						{
							// End date entered, but no start date, throw error
							ec = ErrorCode.getErrorCode("Caseman_startAndEndDatesRequired_Msg");
						}
						else if ( !CaseManUtils.isBlank(startDate) && CaseManUtils.isBlank(endDate) )
						{
							// Start date entered, but no end date, throw error
							ec = ErrorCode.getErrorCode("Caseman_startAndEndDatesRequired_Msg");
						}
						else if ( !CaseManUtils.isBlank(startDate) && !CaseManUtils.isBlank(endDate) )
						{
							if ( DMS_Query_StartDate.validate() != null || DMS_Query_EndDate() != null )
							{
								// Both start date and end date entered, but at least one of them is invalid, throw error
								ec = ErrorCode.getErrorCode("Caseman_startOrEndDateNotValid_Msg");
							}
							else
							{
								// Start and End date entered and values are valid, add them as report parameters
								Reports.setValue(dom, "P_REPORT_START_DATE", CaseManUtils.convertDateToDisplay(startDate) );
								Reports.setValue(dom, "P_REPORT_END_DATE",   CaseManUtils.convertDateToDisplay(endDate));
							}
						}
						else if ( CaseManUtils.isBlank(startDate) && CaseManUtils.isBlank(endDate) )
						{
							// Start and End date fields blank, add as blank parameters to the report
							Reports.setValue(dom, "P_REPORT_START_DATE", "%" );
							Reports.setValue(dom, "P_REPORT_END_DATE",   "%" );
						}
						
						// Check for validity of request for report
						if ( ec != null )
						{
							Services.setTransientStatusBarMessage(ec.getMessage());
							return false;
						}
						
						// Validate the obligation type
						var obligationType = Services.getValue(DMS_Query_ObligationTypeCode.dataBinding);
						if ( !CaseManUtils.isBlank(obligationType) )
						{
							var oblTypeValidate = DMS_Query_ObligationTypeCode.validate();
							if ( oblTypeValidate != null )
							{
								// Obligation Type populated but field is invalid, throw error
								ec = oblTypeValidate;
							}
							else
							{
								// Obligation Type populated and valid, add parameter
								Reports.setValue(dom, "P_REPORT_OBL_TYPE", obligationType);
							}
						}
						else
						{
							// Obligation Type not specified, add as blank parameter
							Reports.setValue(dom, "P_REPORT_OBL_TYPE", "%");
						}
						
						// Check for validity of request for report
						if ( ec != null )
						{
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						else
						{
							// Run the report, do not actually navigate anywhere
							Reports.runReport(dom);
						}
						
						return false;
				   	},
			onMenuBar: true
		},
		{
			id: "NavBar_CasesButton",
			formName: NavigationController.CASES_FORM,
			label: "Cases",
			guard:   function()
					 {
					 	var ec = null;
						var pageNumber = parseInt( Services.getValue(XPathConstants.DMS_PAGENUMBER_XPATH) );
						if ( pageNumber == 0 )
						{
							// No results loaded, prevent navigation
							ec = ErrorCode.getErrorCode("Caseman_DMSInvalidNavigation_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}

					 	return ( null == ec ) ? true : false;
					 },
			prepare: function()
					 {
						// Get the case number from the grid and set the Cases screen form parameter
						var caseNumber = Services.getValue(XPathConstants.DATA_XPATH + "/Obligation[./SurrogateKey=" + Results_ResultsGrid.dataBinding + "]/CaseNumber");
						Services.setValue(CreateCaseParams.CASE_NUMBER, caseNumber);

						// Set the current page number as a new form parameter (will need clearing when screen clears)
						var pageNumber = parseInt( Services.getValue(XPathConstants.DMS_PAGENUMBER_XPATH) );
						Services.setValue(DisplayDMSParams.PAGE_NUMBER, pageNumber);

						// Navigation array setup and go.  Will need to change the CaseManUtils function to clear form parameters
						var navArray = new Array( NavigationController.DMSREPORT_FORM );
						NavigationController.createCallStack(navArray);
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_EventsButton",
			formName: NavigationController.EVENTS_FORM,
			label: "Events",
			guard:   function()
					 {
					 	var ec = null;
						var pageNumber = parseInt( Services.getValue(XPathConstants.DMS_PAGENUMBER_XPATH) );
						if ( pageNumber == 0 )
						{
							// No results loaded, prevent navigation
							ec = ErrorCode.getErrorCode("Caseman_DMSInvalidNavigation_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}

					 	return ( null == ec ) ? true : false;
					 },
			prepare: function()
					 {
						// Get the case number from the grid and set the Case Events screen form parameter
						var caseNumber = Services.getValue(XPathConstants.DATA_XPATH + "/Obligation[./SurrogateKey=" + Results_ResultsGrid.dataBinding + "]/CaseNumber");
						Services.setValue(ManageCaseEventsParams.CASE_NUMBER, caseNumber);

						// Set the current page number as a new form parameter (will need clearing when screen clears)
						var pageNumber = parseInt( Services.getValue(XPathConstants.DMS_PAGENUMBER_XPATH) );
						Services.setValue(DisplayDMSParams.PAGE_NUMBER, pageNumber);

						// Navigation array setup and go.  Will need to change the CaseManUtils function to clear form parameters
						var navArray = new Array( NavigationController.DMSREPORT_FORM );
						NavigationController.createCallStack(navArray);
					 },
			onMenuBar: true
		}
	]
}
