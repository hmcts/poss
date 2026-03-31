/**
 * SUPS CaseMan Word Processing Process class
 * Assistant class for processes/process steps in Word Processing.
 * The process/step composition is not hard coded - rather parsed from the
 * wpctrl configuration xml.
 * @constructor
 */
function OracleReportProcess(name) {
	WPProcess.apply(this, [name]); }

/**
 * SUPS CaseMan Word Processing Process - Object Orientation - setting superclass.
 */
OracleReportProcess.prototype = new WPProcess();

/**
 * SUPS CaseMan Word Processing Process - Object Orientation - setting constructor.
 */
OracleReportProcess.prototype.constructor = OracleReportProcess;

/**
 * SUPS CaseMan Word Processing Process 
 * @type String
 * @returns string representation of this WPProcess
 */
OracleReportProcess.prototype.toString = function() {
	return "CaseMan OracleReportProcess " + this.name; }

/**
 * SUPS CaseMan Word Processing Process 
 * @type boolean
 * @argument ctrl WPCtrl
 * @returns boolean indicating sucessful initialisation of the process class.
 */
OracleReportProcess.Initialize = function(ctrl) {
	var result = WPProcess.ParseConfigurationProcesses(ctrl, "OracleReportProcess");
	var result2 = WPProcess.ParseConfigurationProcessTriggers(ctrl);
	return result && result2; }

/** 
 * SUPS CaseMan Word Processing Process 
 *
 * @returns the case number that triggered this process
 */
OracleReportProcess.prototype.getCaseNumber = function() {
	return WP.GetContextValue(this.getRequest().getContext(), OracleReportXPath.CaseNumber); }

/** 
 * SUPS CaseMan Word Processing Process 
 *
 * @returns the standard event id that triggered this process
 */
OracleReportProcess.prototype.getEvent = function() {
	return WP.GetContextValue(this.getRequest().getContext(), OracleReportXPath.EventStandardId); }

/** 
 * SUPS CaseMan Word Processing Process 
 *
 * @returns the CO number that triggered this process
 */
OracleReportProcess.prototype.getCONumber = function() {
	return WP.GetContextValue(this.getRequest().getContext(), OracleReportXPath.CONumber); }

/** 
 * SUPS CaseMan Word Processing Process 
 *
 * @returns the CO standard event id that triggered this process
 */
OracleReportProcess.prototype.getCOEvent = function() {
	return WP.GetContextValue(this.getRequest().getContext(), OracleReportXPath.COEventStandardId); }

/**
 * SUPS CaseMan Word Processing Process 
 * @argument context contextxml
 * @type WPRequest
 * @returns wprequest 
 */
OracleReportProcess.prototype.determineRequest = function(context, process) {	
	var request = new OracleReportRequest(context, process);
	return request;	}

/**
 * SUPS CaseMan Word Processing Process 
 * @argument context contextxml
 * @type WPOutput
 * @argument contextxml xmldom
 * @argument process 	WPProcess
 * @argument wpctrl		WPCtrl
 * @returns output WPOutput
 */
OracleReportProcess.prototype.determineOutput = function(contextxml, process, wpctrl) {	
	var output = null;
	output = process.getRequest().FindOutputToProcess(contextxml, process, wpctrl, "OracleReportOutput");
	return output; }

/**
 * SUPS CaseMan Word Processing Process Step class
 * @constructor
 */
function OracleReportProcessStep(name) {
	WPProcessStep.apply(this, [name]); }

/**
 * SUPS CaseMan Word Processing Process Step 
 */
OracleReportProcessStep.prototype = new WPProcessStep();

/**
 * SUPS CaseMan Word Processing Process Step 
 */
OracleReportProcessStep.prototype.constructor = OracleReportProcessStep;

/**
 * SUPS CaseMan Word Processing Process Step 
 * @type String
 * @returns string representation of this WPProcess
 */
OracleReportProcessStep.prototype.toString = function() {
	return "OracleReportProcessStep " + this.name;
}

/**
 * SUPS CaseMan Word Processing Process Step 
 * Abstract function - subclasses MUST implement this function
 *
 * @argument wpctrl
 * @argument wpprocess
 */
OracleReportProcessStep.prototype.process = function(wpctrl, wpprocess) {
	// (implementing subclasses MUST) always invoke the WPProcess's preprocess.
	this.preprocess(wpctrl, wpprocess);
	do_X("OracleReportProcessStep.prototype.process() must be overridden by subclass.");  }

/**
 * SUPS WOrd Processing Process Step getConfitionFunction
 * This function returns null or a function which returns a boolean indicating
 * whether it's ok to proceed with the next process step.
 * @type Function
 * @retuns function
 */
OracleReportProcessStep.prototype.getConditionFunction = function() {
	do_X(this + " must implement the .prototype.getConditionFunction() method"); }

/**
 * SUPS CaseMan Word Processing Process Step - determine the request instance
 * for which a dom was returned by a web service call.
 * @argument context contextxml
 * @type WPRequest
 * @returns wprequest 
 */
OracleReportProcessStep.determineRequest = function(dom) {	
	var request = null;
	// analyze dom and get id and find object instance...
	return request;	}

/**
 * WPOutput Step LoadQA Class - Interface with Server side data loading
 * This data loading process step allows the client to gather all data existing in the system
 * to act appropriately.
 * Next process steps could possible create new system data.  The outputs process must not call
 * this method to reload all the data, rather the reload method???
 * @constructor
 * @returns void
 * @throws
 */
function OracleReportProcessStep__LoadQA() {
	OracleReportProcessStep.apply(this,["LoadQA"]); }

/**
 *
 */
OracleReportProcessStep__LoadQA.prototype = new OracleReportProcessStep();

/**
 *
 */
OracleReportProcessStep__LoadQA.prototype.constructor = OracleReportProcessStep__LoadQA;

/**
 *
 */
OracleReportProcessStep__LoadQA.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var output = wpprocess.getOutput();
	var contextXml = wpprocess.getRequest().getContext(); 
	
	var coNumberNode = contextXml.selectSingleNode("/WordProcessing/Event/CONumber");
	var coNumber = null;
	if (null != coNumberNode) coNumber = WPS.getNodeTextContent(coNumberNode);

	var eventSeqNode = contextXml.selectSingleNode("/WordProcessing/Event/COEventSeq");
	var eventSeq = null;
	if (null != eventSeqNode) eventSeq = WPS.getNodeTextContent(eventSeqNode);
	if (null != output) {		
		var QAFormName = "Oracle_Reports_" + output.getCJRReference(); 
		wpctrl.setScreenProcess(wpprocess);

		/** 
		 * If the output has been marked for bulk printing but there is a party on the case who has requested translation
		 * to Welsh, alert the user will be printed locally.  Will also be printed locally if a family enforcement case
		 */
		if (output.getBulkPrint() == "true") {
			var welshIndText = "N";
			var jurisdictionText = "ALL";
			var welshIndNode = contextXml.selectSingleNode("/WordProcessing/Case/WelshTranslation");
			var jurisdictionNode = contextXml.selectSingleNode("/WordProcessing/Case/Jurisdiction");
			if (null != welshIndNode) { welshIndText = WPS.getNodeTextContent(welshIndNode); }
			if (null != jurisdictionNode) { jurisdictionText = WPS.getNodeTextContent(jurisdictionNode); }
			if (welshIndText == "Y") {
				alert("A party associated with this case has requested a Welsh language translation of outputs created.\n"
					+ "As such, the output has not been automatically sent for Bulk Printing and will be printed locally.");
				}
			else if (jurisdictionText == "F") {
				alert("This case is a family enforcement case.\n"
						+ "As such, the output has not been automatically sent for Bulk Printing and will be printed locally.");
				} }
		
		var eventId = output.getEvent();
		if (855 == eventId || 860 == eventId || 864 == eventId || 873 == eventId ) {
			if ( null != contextXml.selectSingleNode("WordProcessing/Event/CONumber")) {
			  Reports = WPS.__Reports();                
              var reportModuleGroup = "CO";
              var coNumber = XML.getNodeTextContent(contextXml.selectSingleNode("WordProcessing/Event/CONumber"));
              var caseEventSeq = XML.getNodeTextContent(contextXml.selectSingleNode("WordProcessing/Event/COEventSeq"));
              var caseEventId = XML.getNodeTextContent(contextXml.selectSingleNode("WordProcessing/Event/StandardEventId"));
              var debtorName = XML.getNodeTextContent(contextXml.selectSingleNode("WordProcessing/Event/DebtorName"));
              var orderId = output.mainOrderID; 
              if ((orderId == null) || (orderId == "")) {
                    orderId = XML.getNodeTextContent(contextXml.selectSingleNode("WordProcessing/Event/EventDetails")); }
              var dom = null;
              if (855 == eventId) {
                    dom = Reports.createReportDom("CM_CO_ORD_2.rdf:CO04,CM_CO_STD_DOC.rdf:TCO10A", reportModuleGroup);  }
              else if (860 == eventId) {
                    dom = Reports.createReportDom("CM_CO_ORD_2.rdf:CO04,CM_CO_STD_DOC.rdf:TCO07A", reportModuleGroup); }
              else if (864 == eventId) {
                    dom = Reports.createReportDom("CM_CO_STD_DOC.rdf:TCO07B", reportModuleGroup);  }           
              else if (873 == eventId) {
                    dom = Reports.createReportDom("CM_CO_STD_DOC.rdf:TCO18", reportModuleGroup);  }                       
              Reports.setValue(dom, "P_DOCUMENT_ID", orderId, reportModuleGroup );
              Reports.setValue(dom, "P_EVENT_SEQ", eventSeq, reportModuleGroup );
              Reports.setValue(dom, "P_PRINT_NOW", "Y", reportModuleGroup );
              Reports.setColumnValue(dom, "CO_TEXT_CO_NUMBER", coNumber, reportModuleGroup );                                        
              Reports.setColumnValue(dom, "CO_TEXT_ORDER_ID", orderId, reportModuleGroup );    
              Reports.setColumnValue(dom, "CO_TEXT_EVENT_SEQ", eventSeq, reportModuleGroup );    
              Reports.setColumnValue(dom, "CO_TEXT_PROMPT", "DUMMY_PROMPT_VALUE", reportModuleGroup );	
              Reports.setColumnValue(dom, "CO_TEXT_HINT_LINE", "DUMMY_HINT_VALUE", reportModuleGroup );
			  Reports.setColumnValue(dom, "CO_TEXT_FORMAT", "DUMMY", reportModuleGroup );    
			  Reports.runReport(dom);
			  return new Function("return true");  }
			else {
			WPS.NavigateTo(QAFormName); } }			            
		else if (892 == eventId) {
			if ( null != contextXml.selectSingleNode("WordProcessing/Event/AENumber")) {
				Reports = WPS.__Reports();                			
				var reportModuleGroup = "AE";
				var orderId = output.mainOrderID; 

				var aeNumber = XML.getNodeTextContent(contextXml.selectSingleNode("WordProcessing/Event/AENumber"));
				var aeEventSeq = XML.getNodeTextContent(contextXml.selectSingleNode("WordProcessing/Event/CaseEventSeq"));
				var aeEventId = XML.getNodeTextContent(contextXml.selectSingleNode("WordProcessing/Event/StandardEventId"));
				var issueStage = XML.getNodeTextContent(contextXml.selectSingleNode("WordProcessing/Event/IssueStage"));
				var dom = Reports.createReportDom("CM_STD_DOC.rdf:P892,CM_STD_DOC.rdf:TBF19", reportModuleGroup);

				var completeEventDetailsNode = contextXml.selectSingleNode("WordProcessing/Event/CompleteEventDetails");
				var eventDetails = "";
				if (null != completeEventDetailsNode)
				{
					eventDetails = XML.getNodeTextContent(completeEventDetailsNode);
				}

				Reports.setValue(dom, "P_DOCUMENT_ID", orderId, reportModuleGroup );
				Reports.setValue(dom, "P_EVENT_SEQ", aeEventSeq, reportModuleGroup );
				Reports.setValue(dom, "P_PRINT_NOW", "Y", reportModuleGroup );
				
				Reports.setColumnValue(dom, "AE_EVENT_SEQ", aeEventSeq, reportModuleGroup );								
				Reports.setColumnValue(dom, "AE_NUMBER", aeNumber, reportModuleGroup );							
				Reports.setColumnValue(dom, "STD_EVENT_ID", aeEventId, reportModuleGroup );		
				Reports.setColumnValue(dom, "ISSUE_STAGE", issueStage, reportModuleGroup );	
				Reports.setColumnValue(dom, "REPORT_VALUE_1", "", reportModuleGroup );						
				Reports.setColumnValue(dom, "REPORT_VALUE_2", "", reportModuleGroup );		
				Reports.setColumnValue(dom, "REPORT_VALUE_3", "", reportModuleGroup );		
				Reports.setColumnValue(dom, "REPORT_VALUE_4", "", reportModuleGroup );	
				Reports.setColumnValue(dom, "REPORT_VALUE_5", "", reportModuleGroup );	
				Reports.setColumnValue(dom, "REPORT_VALUE_6", "", reportModuleGroup );						
				Reports.setColumnValue(dom, "REPORT_VALUE_7", "", reportModuleGroup );		
				Reports.setColumnValue(dom, "REPORT_VALUE_8", "", reportModuleGroup );		
				Reports.setColumnValue(dom, "REPORT_VALUE_9", "", reportModuleGroup );	
				Reports.setColumnValue(dom, "REPORT_VALUE_10", "", reportModuleGroup );
				Reports.setColumnValue(dom, "REPORT_VALUE_11", "", reportModuleGroup );		
				Reports.setColumnValue(dom, "REPORT_VALUE_12", "", reportModuleGroup );		
				Reports.setColumnValue(dom, "REPORT_VALUE_13", "", reportModuleGroup );	
				Reports.setColumnValue(dom, "REPORT_VALUE_14", "", reportModuleGroup );	
				Reports.setColumnValue(dom, "HRG_SEQ", "", reportModuleGroup );	
				Reports.setColumnValue(dom, "WARRANT_ID", "", reportModuleGroup );	
				Reports.setColumnValue(dom, "DETAILS", eventDetails, reportModuleGroup );					
				Reports.runReport(dom);
				return new Function("return true");
			}
			else {
				WPS.NavigateTo(QAFormName);		
			}
		}
		else {
			WPS.NavigateTo(QAFormName);	} }
	else {
		alert("No Form Parameter Screen for Oracle Report Output."); }
	return this.getConditionFunction(wpprocess); }

/** 
 *
 */
OracleReportProcessStep__LoadQA.prototype.getConditionFunction = function(wpprocess) {
	var output = wpprocess.getOutput();
	var waitForQA = (null != output);
	if (true == waitForQA) {
		var stateId = wpprocess.getOutputStateId('QADone');
		return new Function("return WP.CheckState('"+stateId+"', true);"); }
	else {
		return new Function("return true"); } }

/**
 * OracleReportProcessStep__LoadQA web service success handler
 */
OracleReportProcessStep__LoadQA.prototype.onSuccess = function(dom, serviceName) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * OracleReportProcessStep__LoadQA web service business expcetion handler
 */
OracleReportProcessStep__LoadQA.prototype.onBusinessException = function(exception) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * OracleReportProcessStep__LoadQA web service system expcetion handler
 */
OracleReportProcessStep__LoadQA.prototype.onSystemException = function(exception)  {
	WPError.ReportStepServiceError(this, exception); }

/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to load the output as PDF
 * @returns void
 * @throws
 */
function OracleReportProcessStep__ViewPDF() {
	OracleReportProcessStep.apply(this,["ViewPDF"]); 
}

/**
 *
 */
OracleReportProcessStep__ViewPDF.prototype = new OracleReportProcessStep();

/**
 *
 */
OracleReportProcessStep__ViewPDF.prototype.constructor = OracleReportProcessStep__ViewPDF;

/**
 * The current ViewPDF functionality uses the WPPrintApplet solution.
 */
OracleReportProcessStep__ViewPDF.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg = "OracleReportProcessStep__ViewPDF.prototype.process ";
	var output = wpprocess.getOutput();
	var request = wpprocess.getRequest();
	var context = request.getContext();
	
	WPS.__win().Reports.runReport(context);
	
	if (null != output)
	{
		/**var	cfg = "location=no,menubar=no,status=yes,toolbar=no,resizable=1,left=0,top=0,width=800,height=812";
		var win = window.open("about:blank","SUPSORAPDFWindow"+(wpctrl.pdfwindowcount++),cfg, true);
		win.focus();
		var doc = win.document;
		doc.open();
		doc.writeln("<html><head><title>"+output+"</title>");
		doc.writeln("<body>");
		doc.writeln("<applet code=\"uk/gov/dca/caseman/wordprocessing/servlets/WPPrintApplet\" archive=\"/wpprint/wpprint.jar\" width=77 height=24 style=\"position: absolute; top; 0px; left: 0px;\">");
		doc.writeln("<param name=\"jobId\" value=\""+output.getServerId()+"\">");
		doc.writeln("<param name=\"jobXsl\" value=\""+output.getXSLFOUrl()+"\">");
		doc.writeln("</applet>");	
		doc.writeln("<iframe name='PDFView' style='height: 100%; width:100%;'></iframe>");
		doc.writeln("<form name='PDFCreate' action='"+WP.GetSUPSReportServerURL()+"' method='POST' target='PDFView'>");
		doc.writeln("<input type='hidden' name='UniqueId' value='"+output.getServerId()+"'></input>");
		doc.writeln("<input type='hidden' name='xsl-f2'    value='"+output.getXSLFOUrl()+"'></input>");
		doc.writeln("<input type='hidden' name='outputAction' value='CREATE'></input>");
		doc.writeln("</form></body></html>");
		doc.close();
		doc.all.PDFCreate.submit();
		**/
	}
	else
	{
		if (doLog) do_Log(msg + " - no output - no window opening");
	}
	return this.getConditionFunction(wpprocess); }
	
/** 
 *
 * @type Function
 * @returns the condition function - must return true upon evaluation untill the process continues
 */
OracleReportProcessStep__ViewPDF.prototype.getConditionFunction = function(wpprocess) {
	// the the attrib id of the process to provide a hook to the prcess here
	//var stateId = wpprocess.getOutputStateId('ViewPDF');
	//return new Function("return WP.CheckState('"+stateId+"', true);"); }
	return new Function("return true"); }
	
/**
 * OracleReportProcessStep__ViewPDF web service success handler
 */
OracleReportProcessStep__ViewPDF.prototype.onSuccess = function(dom, serviceName) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * OracleReportProcessStep__ViewPDF web service business expcetion handler
 */
OracleReportProcessStep__ViewPDF.prototype.onBusinessException = function(exception) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * OracleReportProcessStep__ViewPDF web service system expcetion handler
 */ 
OracleReportProcessStep__ViewPDF.prototype.onSystemException = function(exception)  {
	WPError.ReportStepServiceError(this, exception); }
								
	
/**
 * WPOutput Step OpenOutput Class - Interface with Server side data loading
 *
 *
 * @constructor
 * @returns void
 * @throws
 */
function OracleReportProcessStep__OpenOutput() {
	OracleReportProcessStep.apply(this,["OpenOutput"]); }

/**
 *
 */
OracleReportProcessStep__OpenOutput.prototype = new OracleReportProcessStep();

/**
 *
 */
OracleReportProcessStep__OpenOutput.prototype.constructor = OracleReportProcessStep__OpenOutput;

/**
 * 
 * @argument wpctrl
 * @argument wpprocess
 */
OracleReportProcessStep__OpenOutput.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg = "OracleReportProcessStep__OpenOutput.prototype.process";
	// get the event seq no
	//var eventSeq = WP.GetContextValue(wpprocess.getRequest().getContext(), OracleReportXPath.EventPK);
	//var params = new ServiceParams();
	//params.addSimpleParameter('eventSeq', '' + eventSeq);
	//WPS.callService("getOutputDocumentFlow", params, this, false); }
	var outputId = WP.GetContextValue(wpprocess.getRequest().getContext(), OracleReportXPath.ctxWPOutputId);
	wpprocess.getOutput().setServerId(outputId);
	return this.getConditionFunction(wpprocess); }

/** 
 *
 */
OracleReportProcessStep__OpenOutput.prototype.getConditionFunction = function(wpprocess) {
	var stateId = wpprocess.getOutputStateId(WPState.ooo_Ready);
	//return new Function("return WP.CheckState('"+stateId+"', true);");}
	return new Function("return true;"); }

/**
 * WPOutput.__LoadData web service success handler
 */
OracleReportProcessStep__OpenOutput.prototype.onSuccess = function(dom, serviceName) {
	var msg = "OracleReportProcessStep__OpenOutput.prototype.onSuccess ";
	var process = this.getProcess();	
	if (doLog) do_Log(msg + " for " + process + " : " + dom.xml);
  	var eventSeqNode = dom.selectSingleNode("/Outputs/Output[1]/EventSeq");
    if (null != eventSeqNode) {
    	var eventSeq =  XML.getNodeTextContent(eventSeqNode); 
    	var editOrPDF = "N" == WPS.getNodeTextContent(dom.selectSingleNode("/Outputs/Output[1]/FinalInd")) ? "edit" : "pdf";
		var outputId = WPS.getNodeTextContent(dom.selectSingleNode("/Outputs/Output[1]/OutputId"));
		WP.SetState(process, WPState.ooo_EdirOrView, editOrPDF);   
		WP.SetState(process, WPState.ooo_OutputId, outputId);  
		WP.SetState(process, WPState.ooo_Ready,'true');   
	}
	else 
	{
		throw new Error(msg="not sure whom replied : <textarea>" +dom2.xml+"</textarea>");	
	} 
	if (doLog) do_Log(msg+"ends"); }

/**
 * OracleReportProcessStep__OpenOutput web service business expcetion handler
 */
OracleReportProcessStep__OpenOutput.prototype.onBusinessException = function(exception) {
	WPError.ReportStepServiceError(this, exception);}

/**
 * OracleReportProcessStep__OpenOutput web service system expcetion handler
 */
OracleReportProcessStep__OpenOutput.prototype.onSystemException = function(exception)  {
	WPError.ReportStepServiceError(this, exception);}

	
	
	
/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to clean up the output process
 * in CaseMAN.
 * @returns void
 * @throws
 */
function OracleReportProcessStep__CleanUp() {
	OracleReportProcessStep.apply(this,["Cleanup"]); 
}

/**
 *
 */
OracleReportProcessStep__CleanUp.prototype = new OracleReportProcessStep();

/**
 *
 */
OracleReportProcessStep__CleanUp.prototype.constructor = OracleReportProcessStep__CleanUp;

/**
 *
 */
OracleReportProcessStep__CleanUp.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg = "OracleReportProcessStep__CleanUp.prototype.process ";
	var output = wpprocess.getOutput();
	if (doLog) do_Log(msg + " for output: " + output);
	
	if (null != output)
	{
		var doRedirection = (true == wpprocess.getAlwaysCallback()) || (null != output);
		if (doLog) {
			do_Log(msg + "doRedirection: " + doRedirection);
			do_Log(msg + "wpprocess.getAlwaysCallback(): " + wpprocess.getAlwaysCallback());
			do_Log(msg + "output: " + output.toString()); }
		if (doRedirection) {
			if (doLog) do_Log(msg + "wpprocess.getCallback(): " + wpprocess.getCallback());
			WPS.NavigateTo(wpprocess.getCallback()); }	
	}
	top.WPCtrl.ClearState(wpprocess);		
	top.WPCtrl.CaseManWPDIDSOMETHING = false;
	top.WPCtrl.CaseManORADIDSOMETHING = true;	
	return this.getConditionFunction(wpprocess); }

/** 
 *
 */
OracleReportProcessStep__CleanUp.prototype.getConditionFunction = function(wpprocess) {
	// the the attrib id of the process to provide a hook to the prcess here
	return new Function("return true"); }
		
/**
 * OracleReportProcessStep__CleanUp web service success handler
 */
OracleReportProcessStep__CleanUp.prototype.onSuccess = function(dom, serviceName) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * OracleReportProcessStep__CleanUp web service business expcetion handler
 */
OracleReportProcessStep__CleanUp.prototype.onBusinessException = function(exception) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * OracleReportProcessStep__CleanUp web service system expcetion handler
 */ 
OracleReportProcessStep__CleanUp.prototype.onSystemException = function(exception)  {
	WPError.ReportStepServiceError(this, exception); }
	