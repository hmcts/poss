/** 
 * @fileoverview ReportUtils.js:
 * This file contains the oracle report utility functions used throughout CaseMan  
 *
 * @author Anoop Sehdev
 *
 * Change History:
 * 01/09/2006 - Chris Vincent, changed PollReport.onSuccess() so screens behave the same
 * 				when report fails as it does when report suceeds but only in terms of post
 * 				report navigation.
 * 03/10/2006 - Mark Groen, defect 5305. Don't allow the report to run twice as prints empty report 2nd time.
 * 12/12/2007 - Chris Hutt, ProgTesting 785 : when AE Event has service status updated to 'NOT SERVED' the reason
 *              should be added to AE_EVENTS.DETAILS
 * 10/02/2010 - Mark Groen.  In function Reports.createReportDom(), check for the Xpath Constant for Oracle Report Court Code.  TRAC 2446
 */

/************************************************************************************
 * REPORT CLASS
 * 
 * Helper class which implements Oracle Report functions. All functions are static.
 ************************************************************************************/
/**
 * var DocumentStoreId = null;
 * @author jzthd2
 * 
 */
function Reports() {}

/** 
 * Returns a new dom with standard values.
 * @param {String} reportModule 		The oracle report module to invoke
 * @param {String} reportModuleGroup 	The oracle report module Group to invoke. possible values CJR, AE, CO, if null, then assumes NONE
 * @returns A dom 
 * @author jzthd2
 */
Reports.createReportDom = function(reportModule, reportModuleGroup)
{
	AUTHENTICATED_COURT = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	AUTHENTICATED_USER = Services.getCurrentUser();
 
	// check for the Xpath Constant for Oracle Report Court Code - TRAC 2446
	if ( CaseManUtils.isBlank(Services.getValue(CaseManFormParameters.OR_COURT_CODE_XPATH)) ){
		// Xpath Constant for Oracle Report Court Code not setup, use user's home court instead
		AUTHENTICATED_COURT = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	}
	else{
		// Use Xpath Constant for Oracle Report Court Code
		AUTHENTICATED_COURT = Services.getValue(CaseManFormParameters.OR_COURT_CODE_XPATH);
	}
	
	
	// Create the report command dom
	var dom = XML.createDOM(null, null, null);
	
	// Insert the standard report fields
	var reportElement = dom.createElement("Report");
	dom.appendChild(reportElement);
	Reports.setStandardValue(dom, "ReportModule", reportModule);
	Reports._reportName = reportModule;
	Reports.setStandardValue(dom, "PrintJobId", "");
	Reports.setStandardValue(dom, "JobId", "");			
	Reports.setStandardValue(dom, "CourtCode", AUTHENTICATED_COURT);	
	Reports.setStandardValue(dom, "CourtUser", AUTHENTICATED_USER);		
		
	if(reportModuleGroup == null)
	{
		Reports.setStandardValue(dom, "ReportModuleGroup", "NONE");
		Reports._moduleGroupName = "NONE";
	}
	else
	{
		Reports.setStandardValue(dom, "ReportModuleGroup", reportModuleGroup);
		Reports._moduleGroupName = reportModuleGroup;
	}

	// Prepare for addition of the report specific fields
	var reportParamsElement = dom.createElement("specificParameters");
	reportElement.appendChild(reportParamsElement);
	if (reportModuleGroup == "CJR" ||  reportModuleGroup == "AE" || reportModuleGroup == "CO")
	{
		var moduleGroupElement = dom.createElement(reportModuleGroup);
		var commonParamElement = dom.createElement("CommonParameters");
		moduleGroupElement.appendChild(commonParamElement);
		reportParamsElement.appendChild(moduleGroupElement);
	}

	return dom;
}


/** 
 * Runs a report and retrieves the job output in a new Window.
 * @param {Dom} reportDom The command details
 * @author jzthd2
 * @return ToMenu != undefined ) ? returnToMenu, null  
 */
Reports.runReport = function(reportDom, returnToMenu, subformAdaptorId)
{


    // ProgTesting 785 : when AE Event has service status updated to 'NOT SERVED' the reason
    // should be added to AE_EVENTS.DETAILS 
    
    var reportModule = reportDom.selectSingleNode("/Report/ReportModule");
    if (reportModule.text == "CM_STD_DOC.rdf:P_NS")
    {
    	var reportValue3 = reportDom.selectSingleNode("/Report/specificParameters/AE/CommonParameters/Column[@name='REPORT_VALUE_3']");
    	if (reportValue3.text != null)
    	{
    		Reports.setColumnValue(reportDom, "DETAILS", reportValue3.text.toUpperCase(), reportModuleGroup );
    	}
    }
   
    
    
	Reports._returnToMenu = ( returnToMenu != undefined ) ? returnToMenu : null;
	Reports._subformAdaptorId = ( subformAdaptorId != undefined ) ? subformAdaptorId : null;
	Reports.runReportRWWebService(reportDom);	// Full solution
}


/** 
 * Runs a report by invoking Framwork Reporting Service.
 * @param {Dom} reportDom The command details
 * @author jzthd2
 * 
 */
Reports.runReportRWWebService = function(reportDom)
{
	Services.setTransientStatusBarMessage("Report generation requested. Please wait...");

	// Prepare for the callback
	var handler = new CasemanServiceHandler();

	handler.onSuccess = function(resultDom)
	{
		// defect 5305. Don't allow the report to run twice as prints empty report 2nd time.
		// need to set flag so know to disable button on CM_WAREX_QUESTION_ONE when the report has been run
		Services.setValue("/ds/var/app/OracleReportForm/CM_WAREX/ReportRun", "true");
		if (Reports._moduleGroupName == "NONE")
		{
			var reportIdNode 	= resultDom.selectSingleNode("/ReportReference/Id");			
			var reportRefIdNode = resultDom.selectSingleNode("/ReportReference/Reference");
			var reportId = XML.getNodeTextContent(reportIdNode);
			var reportRefId = XML.getNodeTextContent(reportRefIdNode);
			//debugger;
			Services.replaceNode("/ds/ReportReference", resultDom);
			if ("undefined" != typeof Progress_Bar)
			{
				Services.setValue(Progress_Bar.dataBinding, "||");
				document.getElementById('Progress_Status').innerHTML = "";
			}
			Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_RAISE);

			pollContentStore();
	  	}
	  	else
	  	{
	  		var reportIdNode 	= resultDom.selectSingleNode("/ReportReference/Id");
	  		var reportRefIdNode = resultDom.selectSingleNode("/ReportReference/Reference");
	  		if (reportIdNode != null)
	  		{
	  			var reportId = XML.getNodeTextContent(reportIdNode);
	  			var reportRefId = XML.getNodeTextContent(reportRefIdNode);
	  			
				Services.replaceNode("/ds/ReportReference", resultDom);
				if ("undefined" != typeof Progress_Bar)
				{
					Services.setValue(Progress_Bar.dataBinding, "||");
					document.getElementById('Progress_Status').innerHTML = "";
				}
				Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_RAISE);

				pollContentStore();
	  		}
		  	else
		  	{
		  		var warrantNode = resultDom.selectSingleNode("/params/param[@name='createWarrantResponse']")
		  		if (warrantNode != null)
		  		{
		  			var warrantNumber = XML.getNodeTextContent(warrantNode);
		  			Services.setTransientStatusBarMessage("Warrant Created : " + warrantNumber);
		  			alert("Warrant Created : " + warrantNumber);
		  			var reportModuleName = XML.getNodeTextContent(resultDom.selectSingleNode("/params/param[@name='reportRequest']/Report/ReportModule"));
		  			if (reportModuleName != "NO_OUTPUT")
		  			{
			  				// Call Run Report Service this time to generate report.
			  				var reportNode = resultDom.selectSingleNode("/params/param[@name='reportRequest']/Report")
							var params = new ServiceParams();
							params.addNodeParameter("reportRequest", reportNode);		
							Services.callService("runReport", params, handler, true);	  				
			  		}
			  		else
			  		{
			  			var process = top.WP.GetScreenProcessORA();
			  			top.WP.SetState(process, 'QADone', true );	
			  		}
			  	}	  	
			 }		  	
		 }
	}

	// submit the report request via server:	
	var params = new ServiceParams();
	params.addDOMParameter("reportRequest", reportDom);

	Services.callService("requestReport", params, handler, true);
}


/**
 * Sets a 'specific' report input parameter in the given Report dom.
 * These are stored as 'Parameter' elements identified by a 'name' attribute:
 * the middle tier needs no knowledge of these parameters.
 * Dates must be set in the display format DD-MON-YYYY.
 * @param dom
 * @param name
 * @param value
 * @author jzthd2
 * 
 */
Reports.setValue = function(dom, name, value)
{
	if (value == null)
	{
		value = "";
	}
	
	var parametersElement = dom.selectSingleNode("/Report/specificParameters");
	
	// Get the parameter entry for the given name.
	var element = parametersElement.selectSingleNode("Parameter[@name='" + name + "']");
	
	if (element == null)
	{
		// Create and append a new element
		element = dom.createElement("Parameter");
		element.setAttribute("name", name);
		parametersElement.appendChild(element);
	}
	else
	{
		// Remove the element's value
		element.removeChild(element.childNodes.item(0));
	}
	
	// Append the new value
	element.appendChild(dom.createTextNode(value));
}

/**
 * @param dom
 * @param name
 * @param value
 * @param moduleGroupName
 * @author jzthd2
 * 
 */
Reports.setColumnValue = function(dom, name, value, moduleGroupName)
{
	if (value == null)
	{
		value = "";
	}
	
	var parametersElement = dom.selectSingleNode("/Report/specificParameters/" + moduleGroupName + "/CommonParameters");
	
	// Get the parameter entry for the given name.
	var element = parametersElement.selectSingleNode("Column[@name='" + name + "']");
	
	if (element == null)
	{
		// Create and append a new element
		element = dom.createElement("Column");
		element.setAttribute("name", name);
		parametersElement.appendChild(element);
	}
	else
	{
		// Remove the element's value
		element.removeChild(element.childNodes.item(0));
	}
	
	// Append the new value
	element.appendChild(dom.createTextNode(value));
}

/**
 * @param dom
 * @param name
 * @param value
 * @param code
 * @param moduleGroupName
 * @param caseNumber
 * @param orderId
 * @author jzthd2
 * 
 */
Reports.setTextItemColumnValue = function(dom, name, value, code, moduleGroupName, caseNumber, orderId)
{
	if (value == null)
	{
		value = "";
	}
	
	var moduleElement = dom.selectSingleNode("/Report/specificParameters/" + moduleGroupName);
	var parametersElement = moduleElement.selectSingleNode("TextItemCommonParameters");
	if (parametersElement == null)
	{
		parametersElement = dom.createElement("TextItemCommonParameters");
		moduleElement.appendChild(parametersElement);
		var caseElement = dom.createElement("Column");
		caseElement.setAttribute("name", "TEXT_CASE_NUMBER");
		caseElement.appendChild(dom.createTextNode(caseNumber));
		parametersElement.appendChild(caseElement);
		
		var ordElement = dom.createElement("Column");
		ordElement.setAttribute("name", "TEXT_ORDER_ORD_ID");
		ordElement.appendChild(dom.createTextNode(orderId));	
		parametersElement.appendChild(ordElement);
	}

	var element = moduleElement.selectSingleNode("Parameter[@name='" + name + "']");
	
	if (element == null)
	{
		// Create and append a new element
		element = dom.createElement("Parameter");
		element.setAttribute("name", name);
		
		column1 = dom.createElement("Column");
		column1.setAttribute("name", "TEXT_VALUE");
		column1.appendChild(dom.createTextNode(value));
		element.appendChild(column1);
		
		column2 = dom.createElement("Column");
		column2.setAttribute("name", "TEXT_DETAIL_CODE");
		column2.appendChild(dom.createTextNode(code));	
		element.appendChild(column2);	
		parametersElement.appendChild(element);
	}
	else
	{
		// Remove the element's value
		element.removeChild(element.childNodes.item(0));
	}
}

/**
 * @param dom
 * @param name
 * @param value
 * @param code
 * @param moduleGroupName
 * @param caseNumber
 * @param orderId
 * @param courtCode
 * @param addressId
 * @author jzthd2
 * 
 */
Reports.setHearingColumnValue = function(dom, name, value, code, moduleGroupName, caseNumber, orderId, courtCode, addressId)
{
	if (value == null)
	{
		value = "";
	}
	var moduleElement = dom.selectSingleNode("/Report/specificParameters/" + moduleGroupName);
	var parametersElement = dom.selectSingleNode("/Report/specificParameters/" + moduleGroupName + "/HearingCommonParameters");

	if (parametersElement == null)
	{
		parametersElement = dom.createElement("HearingCommonParameters");
		moduleElement.appendChild(parametersElement);
		
		var caseElement = dom.createElement("Column");
		caseElement.setAttribute("name", "CASE_NUMBER");
		caseElement.appendChild(dom.createTextNode(caseNumber));
		parametersElement.appendChild(caseElement);
		
		var ordElement = dom.createElement("Column");
		ordElement.setAttribute("name", "HRG_TYPE");
		ordElement.appendChild(dom.createTextNode(orderId));	
		parametersElement.appendChild(ordElement);
		
		var courtElement = dom.createElement("Column");
		courtElement.setAttribute("name", "CRT_CODE");
		courtElement.appendChild(dom.createTextNode(courtCode));	
		parametersElement.appendChild(courtElement);	
		
		var addressElement = dom.createElement("Column");
		addressElement.setAttribute("name", "ADDRESS_ID");
		addressElement.appendChild(dom.createTextNode(addressId));	
		parametersElement.appendChild(addressElement);
		
		var hearSeqElement = dom.createElement("Column");
		hearSeqElement.setAttribute("name", "HRG_SEQ");
		hearSeqElement.appendChild(dom.createTextNode(""));
		parametersElement.appendChild(hearSeqElement);		
		
		var dateOfReceiptToListElement = dom.createElement("Column");
		dateOfReceiptToListElement.setAttribute("name", "DATE_OF_RECEIPT");
		dateOfReceiptToListElement.appendChild(dom.createTextNode( CaseManUtils.getSystemDate(REF_DATA_XPATH + "/SystemDate") ));
		parametersElement.appendChild(dateOfReceiptToListElement);						
	}
	
	// Get the parameter entry for the given name.
	var element = parametersElement.selectSingleNode("Column[@name='" + name + "']");
	
	if (element == null)
	{
		// Create and append a new element
		element = dom.createElement("Column");
		element.setAttribute("name", name);
		parametersElement.appendChild(element);
	}
	else
	{
		// Remove the element's value
		element.removeChild(element.childNodes.item(0));
	}
	
	// Append the new value
	element.appendChild(dom.createTextNode(value));
}

/**
 * @param dom
 * @param name
 * @param value
 * @param code
 * @param moduleGroupName
 * @param coNumber
 * @param hearingType
 * @param courtCode
 * @param addressId
 * @author jzthd2
 * 
 */
Reports.setHearingColumnValueForCO = function(dom, name, value, code, moduleGroupName, coNumber, hearingType, courtCode, addressId)
{
	if (value == null)
	{
		value = "";
	}
	var moduleElement = dom.selectSingleNode("/Report/specificParameters/" + moduleGroupName);
	var parametersElement = dom.selectSingleNode("/Report/specificParameters/" + moduleGroupName + "/HearingCommonParameters");

	if (parametersElement == null)
	{
		parametersElement = dom.createElement("HearingCommonParameters");
		moduleElement.appendChild(parametersElement);
		
		var caseElement = dom.createElement("Column");
		caseElement.setAttribute("name", "CO_NUMBER");
		caseElement.appendChild(dom.createTextNode(coNumber));
		parametersElement.appendChild(caseElement);
		
		var ordElement = dom.createElement("Column");
		ordElement.setAttribute("name", "HRG_TYPE");
		ordElement.appendChild(dom.createTextNode(hearingType));	
		parametersElement.appendChild(ordElement);
		
		var courtElement = dom.createElement("Column");
		courtElement.setAttribute("name", "CRT_CODE");
		courtElement.appendChild(dom.createTextNode(courtCode));	
		parametersElement.appendChild(courtElement);	
		
		var addressElement = dom.createElement("Column");
		addressElement.setAttribute("name", "ADDRESS_ID");
		addressElement.appendChild(dom.createTextNode(addressId));	
		parametersElement.appendChild(addressElement);
		
		var hearSeqElement = dom.createElement("Column");
		hearSeqElement.setAttribute("name", "HRG_SEQ");
		hearSeqElement.appendChild(dom.createTextNode(""));
		parametersElement.appendChild(hearSeqElement);		
		
		var dateOfReceiptToListElement = dom.createElement("Column");
		dateOfReceiptToListElement.setAttribute("name", "DATE_OF_RECEIPT");
		dateOfReceiptToListElement.appendChild(dom.createTextNode(Services.getValue(REF_DATA_XPATH + "/SystemDate")));
		parametersElement.appendChild(dateOfReceiptToListElement);						
	}
	
	// Get the parameter entry for the given name.
	var element = parametersElement.selectSingleNode("Column[@name='" + name + "']");
	
	if (element == null)
	{
		// Create and append a new element
		element = dom.createElement("Column");
		element.setAttribute("name", name);
		parametersElement.appendChild(element);
	}
	else
	{
		// Remove the element's value
		element.removeChild(element.childNodes.item(0));
	}
	
	// Append the new value
	element.appendChild(dom.createTextNode(value));
}


/**
 * @param dom
 * @param aeNumber
 * @param eventNumber
 * @param eventSeq
 * @param moduleGroupName
 * @author jzthd2
 * 
 */
Reports.setWarrantValue = function(dom, aeNumber, eventNumber, eventSeq, moduleGroupName)
{
	//debugger;
	var moduleElement = dom.selectSingleNode("/Report/specificParameters/" + moduleGroupName);
	var parametersElement = dom.selectSingleNode("/Report/specificParameters/" + moduleGroupName + "/WarrantCommonParameters");

	if (parametersElement == null)
	{
		parametersElement = dom.createElement("WarrantCommonParameters");
		moduleElement.appendChild(parametersElement);
		
		var aeNumberElement = dom.createElement("Column");
		aeNumberElement.setAttribute("name", "AE_NUMBER");
		aeNumberElement.appendChild(dom.createTextNode(aeNumber));
		parametersElement.appendChild(aeNumberElement);
		
		var eventNumberElement = dom.createElement("Column");
		eventNumberElement.setAttribute("name", "EVENT_NUMBER");
		eventNumberElement.appendChild(dom.createTextNode(eventNumber));
		parametersElement.appendChild(eventNumberElement);		
		
		var eventSeqElement = dom.createElement("Column");
		eventSeqElement.setAttribute("name", "EVENT_SEQ");
		eventSeqElement.appendChild(dom.createTextNode(eventSeq));
		parametersElement.appendChild(eventSeqElement);						
	}
}

/**
 * @param dom
 * @param aeNumber
 * @param eventNumber
 * @param eventSeq
 * @param moduleGroupName
 * @author jzthd2
 * 
 */
Reports.setWarrantValueForCO = function(dom, aeNumber, eventNumber, eventSeq, moduleGroupName)
{
	var moduleElement = dom.selectSingleNode("/Report/specificParameters/" + moduleGroupName);
	var parametersElement = dom.selectSingleNode("/Report/specificParameters/" + moduleGroupName + "/WarrantCommonParameters");

	if (parametersElement == null)
	{
		parametersElement = dom.createElement("WarrantCommonParameters");
		moduleElement.appendChild(parametersElement);
		
		var aeNumberElement = dom.createElement("Column");
		aeNumberElement.setAttribute("name", "CO_NUMBER");
		aeNumberElement.appendChild(dom.createTextNode(aeNumber));
		parametersElement.appendChild(aeNumberElement);
		
		var eventNumberElement = dom.createElement("Column");
		eventNumberElement.setAttribute("name", "EVENT_NUMBER");
		eventNumberElement.appendChild(dom.createTextNode(eventNumber));
		parametersElement.appendChild(eventNumberElement);		
		
		var eventSeqElement = dom.createElement("Column");
		eventSeqElement.setAttribute("name", "EVENT_SEQ");
		eventSeqElement.appendChild(dom.createTextNode(eventSeq));
		parametersElement.appendChild(eventSeqElement);						
	}
}

/**
 * @param dom
 * @param name
 * @param value
 * @param code
 * @param moduleGroupName
 * @author jzthd2
 * 
 */
Reports.setModuleParameterValue = function(dom, name, value, code, moduleGroupName)
{
	if (value == null)
	{
		value = "";
	}
	
	var parametersElement = dom.selectSingleNode("/Report/specificParameters/" + moduleGroupName);
	
	// Get the parameter entry for the given name.
	var element = parametersElement.selectSingleNode("Parameter[@name='" + name + "']");
	
	if (element == null)
	{
		// Create and append a new element
		element = dom.createElement("Parameter");
		element.setAttribute("name", name);
		
		column1 = dom.createElement("Column");
		column1.setAttribute("name", "TEXT_VALUE");
		column1.appendChild(dom.createTextNode(value));
		element.appendChild(column1);
		
		column2 = dom.createElement("Column");
		column2.setAttribute("name", "TEXT_DETAIL_CODE");
		column2.appendChild(dom.createTextNode(code));	
		element.appendChild(column2);	
		parametersElement.appendChild(element);
	}
	else
	{
		// Remove the element's value
		element.removeChild(element.childNodes.item(0));
	}
	
	// Append the new value
	//element.appendChild(dom.createTextNode(value));
}

/**
 * @param dom
 * @param name
 * @param value
 * @param code
 * @param moduleGroupName
 * @author jzthd2
 * 
 */
Reports.setModuleParameterValueForCO = function(dom, name, value, code, moduleGroupName)
{
	if (value == null)
	{
		value = "";
	}

	if (name == "HRG_TIM")
	{
		value = transformToDisplayTime(value, VAR_PAGE_XPATH + "/Tmp/Hearing/ValidTime");
	}	
	if (name == "HRG_DAT")
	{
		value = CaseManUtils.convertDateToDisplay(value);
	}	
	
	var parametersElement = dom.selectSingleNode("/Report/specificParameters/" + moduleGroupName);
	
	// Get the parameter entry for the given name.
	var element = parametersElement.selectSingleNode("Parameter[@name='" + name + "']");
	
	if (element == null)
	{
		// Create and append a new element
		element = dom.createElement("Parameter");
		element.setAttribute("name", name);
		
		column1 = dom.createElement("Column");
		column1.setAttribute("name", "CO_TEXT_VALUE");
		column1.appendChild(dom.createTextNode(value));
		element.appendChild(column1);
		
		column2 = dom.createElement("Column");
		column2.setAttribute("name", "CO_TEXT_DETAIL_CODE");
		column2.appendChild(dom.createTextNode(code));	
		element.appendChild(column2);	
		
		column3 = dom.createElement("Column");
		column3.setAttribute("name", "CO_TEXT_DOMAIN");
		column3.appendChild(dom.createTextNode(name));	
		element.appendChild(column3);	
			
		parametersElement.appendChild(element);
	}
	else
	{
	}
}

/**
 * @param dom
 * @param name
 * @param value
 * @param tableName
 * @param keyName
 * @param columnName
 * @param fieldType
 * @param moduleGroupName
 * @author jzthd2
 * 
 */
Reports.setAppParameterValue = function(dom, name, value, tableName, keyName, columnName, fieldType, moduleGroupName)
{
	if (value == null)
	{
		value = "";
	}
	
	var parametersElement = dom.selectSingleNode("/Report/specificParameters/" + moduleGroupName);
	
	// Get the parameter entry for the given name.
	var element = parametersElement.selectSingleNode("AppParameter[@name='" + name + "']");
	
	if (element == null)
	{
		// Create and append a new element
		element = dom.createElement("AppParameter");
		element.setAttribute("name", name);
		element.setAttribute("table", tableName);
		element.setAttribute("key", keyName);
		element.setAttribute("column", columnName);
		element.setAttribute("type", fieldType);
		parametersElement.appendChild(element);
	}
	else
	{
		// Remove the element's value
		element.removeChild(element.childNodes.item(0));
	}
	
	// Append the new value
	element.appendChild(dom.createTextNode(value));
}

/**
 * Sets a 'standard' report input parameter in the given Report dom.
 * These use predefined element names, which the middle may use and depend on.
 */

/**
 * @param dom
 * @param name
 * @param value
 * @author jzthd2
 * 
 */
Reports.setStandardValue = function(dom, name, value)
{
	if (value == null)
	{
		value = "";
	}
	
	var reportElement = dom.selectSingleNode("/Report");
	var element = reportElement.selectSingleNode(name);
	
	if (element == null)
	{
		// Create and append a new element
		element = dom.createElement(name);
		reportElement.appendChild(element);
	}
	else
	{
		// Remove the element's value
		element.removeChild(element.childNodes.item(0));
	}
	
	// Append the new value
	element.appendChild(dom.createTextNode(value));
}

/************************************************************************************
 * STANDARD HANDLER CLASS FOR SERVICE CALLS
 * 
 * Usage:
 * var handler = new CasemanServiceHandler();
 * handler.onSuccess = function(reslutDom)
 * {
 *     // handle success here
 * }
 *
 * Services.callService("methodName", params, handler, false);
 ************************************************************************************/
function CasemanServiceHandler() {};

/**
 * @param exception
 * @author jzthd2
 * 
 */
CasemanServiceHandler.prototype.onError = function(exception)
{
	// Loop through the exception handlers (giving precedence to more specialist exceptions)
	var preExceptionMethod = null;
	for (var i = exception.exceptionHierarchy.length - 1 ; i >= 0 ; i--)
	{
	    preExceptionMethod = eval("this.onPre" + exception.exceptionHierarchy[i]);
		// Does the callback handler implement an exception handler for this exception
		if(preExceptionMethod != undefined)
		{
			preExceptionMethod.call(this, exception);
			break;
		}
	}
	
    Logging.error(exception.message);
	var err = null;
	if (exception.message.indexOf("'") < 0)
	{
		ErrorCode.getErrorCode("Caseman_Err" + exception.name);
	}
    
    // if no message exists for exception type.
    if (err == null || err.getMessage() == null || err.getMessage() == "")
    {
    	//FormController.getInstance().setStatusBarMessage(exception.message);
    	Services.setTransientStatusBarMessage(exception.message);
    	alert(exception.message);
    }
    else // display message.
    {
    	Services.setTransientStatusBarMessage(err.message);
    	alert(err.message);
    }
    
	// Loop through the exception handlers (giving precedence to more specialist exceptions)
	var postExceptionMethod = null;
	for (var i = exception.exceptionHierarchy.length - 1 ; i >= 0 ; i--)
	{
	    postExceptionMethod = eval("this.onPost" + exception.exceptionHierarchy[i]);
		// Does the callback handler implement an exception handler for this exception
		if(postExceptionMethod != undefined)
		{
			postExceptionMethod.call(this, exception);
			break;
		}
	}
	if (Reports._moduleGroupName != "NONE")
	{
		NavigationController.nextScreen(); // Goes back to calling screen
	}
	
}

/**
 * @param exception
 * @author jzthd2
 * 
 */
CasemanServiceHandler.prototype.onBusinessException = function(exception)
{
	// Loop through the exception handlers (giving precedence to more specialist exceptions)
	var preExceptionMethod = null;
	for (var i = exception.exceptionHierarchy.length - 1 ; i >= 0 ; i--)
	{
	    preExceptionMethod = eval("this.onPre" + exception.exceptionHierarchy[i]);
		// Does the callback handler implement an exception handler for this exception
		if(preExceptionMethod != undefined)
		{
			preExceptionMethod.call(this, exception);
			break;
		}
	}
	
	var err = null;
	if (exception.message.indexOf("'") < 0)
	{
    	err = ErrorCode.getErrorCode(exception.message);
    }
    
    // if no message exists for exception type.
    if (err == null || err.getMessage() == null || err.getMessage() == "")
    {
    	Services.setTransientStatusBarMessage(exception.message);
    	alert(exception.message);
    }
    else // display message.
    {
    	Services.setTransientStatusBarMessage(err.message);
    	alert(err.message);
    }
    
	// Loop through the exception handlers (giving precedence to more specialist exceptions)
	var postExceptionMethod = null;
	for (var i = exception.exceptionHierarchy.length - 1 ; i >= 0 ; i--)
	{
	    postExceptionMethod = eval("this.onPost" + exception.exceptionHierarchy[i]);
		// Does the callback handler implement an exception handler for this exception
		if(postExceptionMethod != undefined)
		{
			postExceptionMethod.call(this, exception);
			break;
		}
	}
	if (Reports._moduleGroupName != "NONE")
	{
		NavigationController.nextScreen(); // Goes back to calling screen
	}	
}

/**
 * @param exception
 * @author jzthd2
 * 
 */
CasemanServiceHandler.prototype.onUpdateLockedException = function(exception)
{
	// Loop through the exception handlers (giving precedence to more specialist exceptions)
	var preExceptionMethod = null;
	for (var i = exception.exceptionHierarchy.length - 1 ; i >= 0 ; i--)
	{
	    preExceptionMethod = eval("this.onPre" + exception.exceptionHierarchy[i]);
		// Does the callback handler implement an exception handler for this exception
		if(preExceptionMethod != undefined)
		{
			preExceptionMethod.call(this, exception);
			break;
		}
	}
	
	var err = err = ErrorCode.getErrorCode("Caseman_ErrUpdateLockedException");
    
    // if no message exists for exception type.
    if (err == null || err.getMessage() == null || err.getMessage() == "")
    {
    	Services.setTransientStatusBarMessage(exception.message);
    	alert(exception.message);
    }
    else // display message.
    {
    	Services.setTransientStatusBarMessage(err.message);
    	alert(err.message);
    }
    
	// Loop through the exception handlers (giving precedence to more specialist exceptions)
	var postExceptionMethod = null;
	for (var i = exception.exceptionHierarchy.length - 1 ; i >= 0 ; i--)
	{
	    postExceptionMethod = eval("this.onPost" + exception.exceptionHierarchy[i]);
		// Does the callback handler implement an exception handler for this exception
		if(postExceptionMethod != undefined)
		{
			postExceptionMethod.call(this, exception);
			break;
		}
	}
	if (Reports._moduleGroupName != "NONE")
	{
		NavigationController.nextScreen(); // Goes back to calling screen
	}	
}	

/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author jzthd2
 * 
 */
CasemanServiceHandler.prototype.onAuthorizationException = function(exception) 
{
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
	if (Reports._moduleGroupName != "NONE")
	{
		NavigationController.nextScreen(); // Goes back to calling screen
	}	
}

/**
 * @author jzthd2
 * 
 */
function pollContentStore() 
{
	if ("undefined" != typeof Progress_Bar)
	{
		Services.setValue(Progress_Bar.dataBinding, Services.getValue(Progress_Bar.dataBinding) + "||");
	}
	var resultNode = Services.getNode("/ds/ReportReference");
	var params = new ServiceParams();
	params.addNodeParameter("ReportReference", resultNode);		
	
	if("undefined" != typeof Popup_Cancel && !Popup_Cancel.cancelled) 
	{
		Services.callService("getReport", params, PollReport, null);
	}
}

/**
 * @author jzthd2
 * 
 */
function PollReport()
{
}

/**
 * @param dom
 * @author jzthd2
 * @return ToMenu != null), boolean 
 */
PollReport.onSuccess = function(dom)
{
	var statusNode	 	= dom.selectSingleNode("/ReportResponse/Status");
	var printStatusNode	= dom.selectSingleNode("/ReportResponse/PrintStatus");
	
	var status			= XML.getNodeTextContent(statusNode);
	var printStatus		= XML.getNodeTextContent(printStatusNode);
	
	document.getElementById('Progress_Status').innerHTML = getStatusBarMessage(status);
	
	if(status == '5') // Cancelled
	{
		Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
		NavigationController.nextScreen(); // Goes back to calling screen
	}
	else if(status == '4') // Error
	{
		var errorDescNode	= dom.selectSingleNode("/ReportResponse/Error");
		var errorDesc		= XML.getNodeTextContent(errorDescNode);
		document.getElementById('Progress_Status').innerHTML = errorDesc;	
		if (Reports._moduleGroupName == "NONE")
		{
			// 01/09/2006 - CPV: added code so if report fails, will perform the same way
			// as if the report succeeded in terms of navigation post report gen.
			if (Reports._returnToMenu != null)
			{
				if (Reports._returnToMenu == true)
				{
					Services.navigate(NavigationController.MAIN_MENU);
				}
			}
			else
			{
				if ( !CaseManUtils.isBlank(Reports._subformAdaptorId) )
				{
					// Called from a subform so close the subform
					Services.dispatchEvent(Reports._subformAdaptorId, BusinessLifeCycleEvents.EVENT_CANCEL);
				}
				else
				{
					// Called from a screen so navigate back to the previous screen
					NavigationController.nextScreen();
				}
			}
		}
	}	
	else if (status == "2")
	{
		Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
		if (Reports._moduleGroupName == "NONE")
		{
			Services.setTransientStatusBarMessage("Report generation completed.");
			var documentIdNode	= dom.selectSingleNode("/ReportResponse/DocumentId");
			var documentId		= XML.getNodeTextContent(documentIdNode);
			// Show only CM_LINEUP and CM_PYORD reports
			if (Reports._reportName == "CM_LINEUP.rdf" || Reports._reportName == "CM_PYORD.rdf") 
			{
				Services.showDocument(documentId, documentId);	
			}
			if (Reports._returnToMenu != null)
			{
				if (Reports._returnToMenu == true)
				{
					Services.navigate(NavigationController.MAIN_MENU);
				}
			}
			else
			{
				if ( !CaseManUtils.isBlank(Reports._subformAdaptorId) )
				{
					// Called from a subform so close the subform
					Services.dispatchEvent(Reports._subformAdaptorId, BusinessLifeCycleEvents.EVENT_CANCEL);
				}
				else
				{
					// Called from a screen so navigate back to the previous screen
					NavigationController.nextScreen();
				}
			}			
		}
		else
		{
			var process = top.WP.GetScreenProcessORA();
			top.WP.SetState(process, 'QADone', true );			
		}
		

	
	}
	else
	{
		window.setTimeout("pollContentStore()", 2000);
	}
}


/**
 * @param status
 * @author jzthd2
 * @return " Status, Report has been queued" , Report is being generated" , Report is being saved" , Report generation has completed" , " Ststus, Error in producing Report" , " "  
 */
function getStatusBarMessage(status) {
	switch(status) {
		case "0":
		return " Status: Report has been queued";
		break;
		
		case "1":
		return " Status: Report is being generated";
		break;
		
		case "2":
		return " Status: Report is being saved";
		break;
		
		case "3":
		return " Status: Report generation has completed";
		break;
		
		case "4":
		return " Ststus: Error in producing Report";
		break;
		
		case "5":
		return " ";
		break;
	}
}


/**
 * @param serviceName
 * @param params
 * @param asyncSrcData
 * @author jzthd2
 * 
 */
Reports.callAsync = function(serviceName, params, asyncSrcData)
{
    var handler = new Object();

    handler.onSuccess = function(dom)
    {
        Services.replaceNode(asyncSrcData, dom);
    }
    handler.onError = function(error)
    {
        alert(error.message);
    }
    Services.callService(serviceName, params, handler);
}

function Util() {}
Util.prototype = new Object();
Util.prototype.constructor = Util;

/**
 * Open the popup.
 * @param popupId The popup id as specified in the <div>
 * @author jzthd2
 * 
 */
Util.openPopup = function(popupId)
{
    Services.dispatchEvent(popupId, PopupGUIAdaptor.EVENT_RAISE);
}

/**
 * Closes the popup.
 * @param popupId The popup id as specified in the <div>
 * @author jzthd2
 * 
 */
Util.closePopup = function(popupId)
{
    Services.dispatchEvent(popupId, PopupGUIAdaptor.EVENT_LOWER);
}
