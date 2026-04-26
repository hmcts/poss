/**
 * SUPS CaseMan Word Processing Process class
 * Assistant class for processes/process steps in Word Processing.
 * The process/step composition is not hard coded - rather parsed from the
 * wpctrl configuration xml.
 * @constructor
 */
function CaseManWPProcess(name) {
	WPProcess.apply(this, [name]); }

/**
 * SUPS CaseMan Word Processing Process - Object Orientation - setting superclass.
 */
CaseManWPProcess.prototype = new WPProcess();

/**
 * SUPS CaseMan Word Processing Process - Object Orientation - setting constructor.
 */
CaseManWPProcess.prototype.constructor = CaseManWPProcess;

/**
 * SUPS CaseMan Word Processing Process 
 * @type String
 * @returns string representation of this WPProcess
 */
CaseManWPProcess.prototype.toString = function() {
	return "CaseMan WPProcess " + this.name; }

/**
 *
 */
CaseManWPProcess.prototype.mayEditOutputNow = function() 
{
	var msg = "CaseManWPProcess.prototype.mayEditOutputNow ";
	var val = false;
	var processName = this.getName();
	var output = this.getOutput();
	if ("true" == output.getDoWP()) 
	{
		if ("Open" == processName)
		{
			var finalOutputNode = this.getRequest().getContext().selectSingleNode("/WordProcessing/Final");
			var finalOutputValue = WPS.getNodeTextContent(finalOutputNode);
			if ("Y" != finalOutputValue) 
			{
				val = true;
			}
		}
		else if ("Create" == processName)
		{
			val = true;
		}		
	}	
	if (doLog) do_Log(msg+" returns: " + val);	
	return val;
}

/**
 * SUPS CaseMan Word Processing Process 
 * @type boolean
 * @argument ctrl WPCtrl
 * @returns boolean indicating sucessful initialisation of the process class.
 */
CaseManWPProcess.Initialize = function(ctrl) {
	var result = WPProcess.ParseConfigurationProcesses(ctrl, "CaseManWPProcess");
	var result2 = WPProcess.ParseConfigurationProcessTriggers(ctrl);
	return result && result2; }

/** 
 * SUPS CaseMan Word Processing Process 
 *
 * @returns the case number that triggered this process
 */
CaseManWPProcess.prototype.getCaseNumber = function() {
	return WP.GetContextValue(this.getRequest().getContext(), CaseManWPXPath.CaseNumber); }

/** 
 * SUPS CaseMan Word Processing Process 
 *
 * @returns the standard event id that triggered this process
 */
CaseManWPProcess.prototype.getEvent = function() {
	return WP.GetContextValue(this.getRequest().getContext(), CaseManWPXPath.EventStandardId); }

/** 
 * SUPS CaseMan Word Processing Process 
 *
 * @returns the CO number that triggered this process
 */
CaseManWPProcess.prototype.getCONumber = function() {
	return WP.GetContextValue(this.getRequest().getContext(), CaseManWPXPath.CONumber); }

/** 
 * SUPS CaseMan Word Processing Process 
 *
 * @returns the CO standard event id that triggered this process
 */
CaseManWPProcess.prototype.getCOEvent = function() {
	return WP.GetContextValue(this.getRequest().getContext(), CaseManWPXPath.COEventStandardId); }

/**
 * SUPS CaseMan Word Processing Process 
 * @argument context contextxml
 * @type WPRequest
 * @returns wprequest 
 */
CaseManWPProcess.prototype.determineRequest = function(context, process) {	
	var request = null;
	var processName = this.name
	switch(processName) {
		case "Create":
			request = new CaseManCreateRequest(context, process);
			break;
		case "Open":
			request = new CaseManEditOrViewRequest(context, process);
			break;
		case "Print":
			request = new CaseManPrintRequest(context, process);
			break; }
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
CaseManWPProcess.prototype.determineOutput = function(contextxml, process, wpctrl) {	
	var output = null;
	output = process.getRequest().FindOutputToProcess(contextxml, process, wpctrl, "CaseManWPOutput");
	return output; }

/**
 * SUPS CaseMan Word Processing Process Step class
 * @constructor
 */
function CaseManWPProcessStep(name) {
	WPProcessStep.apply(this, [name]); }

/**
 * SUPS CaseMan Word Processing Process Step 
 */
CaseManWPProcessStep.prototype = new WPProcessStep();

/**
 * SUPS CaseMan Word Processing Process Step 
 */
CaseManWPProcessStep.prototype.constructor = CaseManWPProcessStep;

/**
 * SUPS CaseMan Word Processing Process Step 
 * @type String
 * @returns string representation of this WPProcess
 */
CaseManWPProcessStep.prototype.toString = function() {
	return "CaseManWPProcessStep " + this.name;
}

/**
 * SUPS CaseMan Word Processing Process Step 
 * Abstract function - subclasses MUST implement this function
 *
 * @argument wpctrl
 * @argument wpprocess
 */
CaseManWPProcessStep.prototype.process = function(wpctrl, wpprocess) {
	// (implementing subclasses MUST) always invoke the WPProcess's preprocess.
	this.preprocess(wpctrl, wpprocess);
	do_X("CaseManWPProcessStep.prototype.process() must be subclassed to put some meat in...");
}

/**
 * SUPS WOrd Processing Process Step getConfitionFunction
 * This function returns null or a function which returns a boolean indicating
 * whether it's ok to proceed with the next process step.
 * @type Function
 * @retuns function
 */
CaseManWPProcessStep.prototype.getConditionFunction = function() {
	do_X(this + " must implement the .prototype.getConditionFunction() method");
}


/**
 * SUPS CaseMan Word Processing Process Step - determine the request instance
 * for which a dom was returned by a web service call.
 * @argument context contextxml
 * @type WPRequest
 * @returns wprequest 
 */
CaseManWPProcessStep.determineRequest = function(dom) {	
	var request = null;
	// analyze dom and get id and find object instance...
	return request;	
}


/**
 * WPOutput Step LoadData Class - Interface with Server side data loading
 * This data loading process step allows the client to gather all data existing in the system
 * to act appropriately.
 * Next process steps could possible create new system data.  The outputs process must not call
 * this method to reload all the data, rather the reload method???
 * @constructor
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__LoadData() {
	CaseManWPProcessStep.apply(this,["LoadData"]); }

/**
 *
 */
CaseManWPProcessStep__LoadData.prototype = new CaseManWPProcessStep();

/**
 *
 */
CaseManWPProcessStep__LoadData.prototype.constructor = CaseManWPProcessStep__LoadData;

/**
 * 
 * @argument wpctrl
 * @argument wpprocess
 */
CaseManWPProcessStep__LoadData.prototype.process = function(wpctrl, wpprocess) {
	// always invoke the WPProcess's preprocess.
	this.preprocess(wpctrl, wpprocess);
	var msg = "CaseManWPProcessStep__LoadData.prototype.process ";
	if (wpctrl.stubbedData) { /** using stubbed data **/
		__dom = WPS.createDOM();
		__dom.loadXML("<root/>");
		setTimeout("CaseManWPProcessStep__LoadData.onSuccess(__dom); __dom=null;",1); }
	else { /** using real data **/
		var params = new NonFormServiceParams();
		var output = wpprocess.getOutput();
		if (null != output)
		{
			params.addSimpleParameter('output', '' + output.getCJRReference());
			params.addSimpleParameter('outputUniqueID', '' + output.getUniqueId(this));
			var contextxml = wpprocess.getRequest().getContext();
			params.addDOMParameter('xml', contextxml);		
			
			var CaseNumberNode = contextxml.selectSingleNode(CaseManWPXPath.CaseNumber);
			var CaseNumber = "";
			if (null != CaseNumberNode) CaseNumber = WPS.getNodeTextContent(CaseNumberNode);
			params.addSimpleParameter('caseNumber', CaseNumber);
			
			var CONumberNode = contextxml.selectSingleNode(CaseManWPXPath.CONumber);
			var CONumber = "";
			if (null != CONumberNode) CONumber = WPS.getNodeTextContent(CONumberNode);
			params.addSimpleParameter('coNumber', CONumber);
			
			
			var vardataxxml = WP.GetState(wpprocess, "wpvariabledata");	
			if (null != vardataxxml) {
				params.addDOMParameter('vardata', vardataxxml);
				if (doLog) do_Log(msg + " removing wpvariabledata from the session");
				msg += " variable data dom supplied."; }
			else {
				msg += " no variabledata dom supplied."; }
			if (doLog) do_Log(msg);
			WPS.callService("getNoticeOfIssueData", params, this, false); }		
		}
		return this.getConditionFunction(wpprocess); }

/** 
 *
 */
CaseManWPProcessStep__LoadData.prototype.getConditionFunction = function(wpprocess) {
	// the the attrib id of the process to provide a hook to the prcess here
	var stateId = wpprocess.getOutputStateId('dataLoadDone');
	return new Function("return WP.CheckState('"+stateId+"', true);"); }

/**
 * WPOutput.__LoadData web service success handler
 */
CaseManWPProcessStep__LoadData.prototype.onSuccess = function(dom, serviceName) {
	var msg = "CaseManWPProcessStep__LoadData.prototype.onSuccess ";
	var process = this.getProcess();	
	if (doLog) do_Log(msg + " for " + process + " : " + dom.xml);
	var number = null;
	var parties = new Array();
	var screentype = "";
	var maintainCaseNode = dom.selectSingleNode(CaseManWPXPath.dsDOM_ManageCase);
	if (null != maintainCaseNode)	{
		screentype = "Case";	
		var numberNode = maintainCaseNode.selectSingleNode(CaseManWPXPath.dsDOM_CaseNumber);
		if (null != numberNode) number = WPS.getNodeTextContent(numberNode);
		var partyNodes = maintainCaseNode.selectNodes(CaseManWPXPath.dsDOM_CaseParties);
		var noOfParties = partyNodes.length;
		for(var i=0; i<noOfParties; i++) {
			var party = partyNodes[i]
			parties.push(party); } }
	else {
		screentype = "CO";	
		var maintainCONode = dom.selectSingleNode(CaseManWPXPath.dsDOM_MaintainCO);
		var numberNode = maintainCONode.selectSingleNode(CaseManWPXPath.dsDOM_CONumber);
		if (null != numberNode) number = WPS.getNodeTextContent(numberNode);
	
		var debtorNode = maintainCONode.selectSingleNode(CaseManWPXPath.dsDOM_CODebtor);
		var debtorNameNode = maintainCONode.selectSingleNode(CaseManWPXPath.dsDOM_CODebtorName);
		var debtorName = null != debtorNameNode ? WPS.getNodeTextContent(debtorNameNode) : "n/a";
		var debtorIdNode = debtorNode.selectSingleNode(CaseManWPXPath.dsDOM_CODebtorId);
		var debtorId = null != debtorIdNode ? WPS.getNodeTextContent(debtorIdNode) : "n/a";
		debtorNode.appendChild(debtorNameNode.cloneNode(true));
		var partyType = debtorNode.ownerDocument.createElement("PartyType");
		partyType.appendChild(debtorNode.ownerDocument.createTextNode(CMC.PartyTypeCodesEnum.DEBTOR));
		debtorNode.appendChild(partyType);
		var partyType2 = debtorNode.ownerDocument.createElement("Type");
		partyType2.appendChild(debtorNode.ownerDocument.createTextNode("Debtor"));
		debtorNode.appendChild(partyType2);
		parties.push(debtorNode);
	
		var employerNode = maintainCONode.selectSingleNode(CaseManWPXPath.dsDOM_COEmployer);
		var employerNameNode = employerNode.selectSingleNode(CaseManWPXPath.dsDOM_COEmployerName);
		var employerName = null != employerNameNode ? WPS.getNodeTextContent(employerNameNode) : "n/a";
		var employerIdNode = employerNode.selectSingleNode(CaseManWPXPath.dsDOM_COEmployerId);
		var employerId = null != employerIdNode ? WPS.getNodeTextContent(employerIdNode) : "n/a";
		employerNode.appendChild(employerNameNode.cloneNode(true));
		var partyType = employerNode.ownerDocument.createElement("PartyType");
		partyType.appendChild(employerNode.ownerDocument.createTextNode(CMC.PartyTypeCodesEnum.EMPLOYER));
		employerNode.appendChild(partyType);
		var partyType2 = employerNode.ownerDocument.createElement("Type");
		partyType2.appendChild(employerNode.ownerDocument.createTextNode("Employer"));
		employerNode.appendChild(partyType2);
		parties.push(employerNode);
	
		var partyNodes = maintainCONode.selectNodes(CaseManWPXPath.dsDOM_COCreditor);
		var noOfParties = partyNodes.length;
		for(var i=0; i<noOfParties; i++) {
			var party = partyNodes[i]
			partyType = party.ownerDocument.createElement("PartyType");
			partyType.appendChild(party.ownerDocument.createTextNode(CMC.PartyTypeCodesEnum.CREDITOR));
			party.appendChild(partyType);
			partyType2 = party.ownerDocument.createElement("Type");
			partyType2.appendChild(party.ownerDocument.createTextNode("Creditor"));
			party.appendChild(partyType2);
			parties.push(party); } }
			
	WP.SetQA_ScreenType(screentype, process);
	WP.SetQA_HeaderNumber(number, process);
	WP.SetQA_HeaderParties(parties, process);
	WP.SetState(process, WPState.ds_DOM, dom);
	WP.SetState(process, WPState.ds_DOM_Ready, true); }

/**
 * CaseManWPProcessStep__LoadData web service business expcetion handler
 */
CaseManWPProcessStep__LoadData.prototype.onBusinessException = function(exception) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * CaseManWPProcessStep__LoadData web service system expcetion handler
 */
CaseManWPProcessStep__LoadData.prototype.onSystemException = function(exception)  {
	WPError.ReportStepServiceError(this, exception); }


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
function CaseManWPProcessStep__LoadQA() {
	CaseManWPProcessStep.apply(this,["LoadQA"]); }

/**
 *
 */
CaseManWPProcessStep__LoadQA.prototype = new CaseManWPProcessStep();

/**
 *
 */
CaseManWPProcessStep__LoadQA.prototype.constructor = CaseManWPProcessStep__LoadQA;

/**
 *
 */
CaseManWPProcessStep__LoadQA.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var output = wpprocess.getOutput();
	var doQA = output.getDoQA();
	if ("true" == doQA) {
		var QAFormName = "EnterVariableData_" + wpprocess.getOutput().getCJRReference();
		WPS.NavigateTo(QAFormName);
		wpctrl.setScreenProcess(wpprocess); }
	return this.getConditionFunction(wpprocess); }

/** 
 *
 */
CaseManWPProcessStep__LoadQA.prototype.getConditionFunction = function(wpprocess) {
	// the the attrib id of the process to provide a hook to the prcess here
	var output = wpprocess.getOutput();
	var waitForQA = output.getDoQA();
	if ("true" == waitForQA) {
		var stateId = wpprocess.getOutputStateId('QADone');
		return new Function("return WP.CheckState('"+stateId+"', true);"); }
	else {
		return new Function("return true"); } }

/**
 * CaseManWPProcessStep__LoadQA web service success handler
 */
CaseManWPProcessStep__LoadQA.prototype.onSuccess = function(dom, serviceName) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * CaseManWPProcessStep__LoadQA web service business expcetion handler
 */
CaseManWPProcessStep__LoadQA.prototype.onBusinessException = function(exception) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * CaseManWPProcessStep__LoadQA web service system expcetion handler
 */
CaseManWPProcessStep__LoadQA.prototype.onSystemException = function(exception)  {
	WPError.ReportStepServiceError(this, exception); }


/**
 * WPOutput Nested Class - Interface with Server side data loading
 * This data loading process step allows the client to gather all data existing in the system
 * to act appropriately.
 * Next process steps could possible create new system data.  The outputs process must not call
 * this method to reload all the data, rather the reload method???
 * @constructor
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__ReLoadData() {
	CaseManWPProcessStep.apply(this,["ReLoadData"]); }

/**
 *
 */
CaseManWPProcessStep__ReLoadData.prototype = new CaseManWPProcessStep();

/**
 *
 */
CaseManWPProcessStep__ReLoadData.prototype.constructor = CaseManWPProcessStep__ReLoadData;


CaseManWPProcessStep__ReLoadData.prototype.process = function(wpctrl, wpprocess) {
	// always invoke the WPProcess's preprocess.
	this.preprocess(wpctrl, wpprocess);
	var msg = "CaseManWPProcessStep__ReLoadData.prototype.process ";
	var output = wpprocess.getOutput();
	var doReload = output.getDoReload();
	if (doLog) do_Log(msg + " .process() - output: " + output);
	if (doLog) do_Log(msg + " .process() - doReload: " + doReload);
	if ("true" == doReload) {
		if (true == wpctrl.stubbedData) { /** using stubbed data **/
			if (doLog) do_Log(msg + " .process() - wpctrl.stubbedData: " + wpctrl.stubbedData);
			__dom = WPS.createDOM();
			__dom.loadXML("<root/>");
			setTimeout("CaseManWPProcessStep__ReLoadData.onSuccess(__dom); __dom=null;",1); }
		else { /** using real data **/
			if (doLog) do_Log(msg + " .process() - wpctrl.stubbedData: " + wpctrl.stubbedData);
			var params = new NonFormServiceParams();
			var output = wpprocess.getOutput();
			params.addSimpleParameter('output', '' + output.getCJRReference());
			params.addSimpleParameter('outputUniqueID', '' + output.getUniqueId(this));
			var contextxml = wpprocess.getRequest().getContext();
			params.addDOMParameter('xml', contextxml);		
			var caseNumber = WPS.getNodeTextContent(contextxml.selectSingleNode(CaseManWPXPath.CaseNumber));
			params.addSimpleParameter('caseNumber', caseNumber);
			var vardataxxml = WP.GetState(wpprocess, "wpvariabledata");	
			if (null != vardataxxml) {
				params.addDOMParameter('vardata', vardataxxml);
				if (doLog) do_Log(msg + " removing wpvariabledata from the session");
				msg += " variable data dom supplied."; }
			else {
				msg += " no variabledata dom supplied."; }
			if (doLog) do_Log(msg+"calling service getNoticeOfIssueData");
			WPS.callService("getNoticeOfIssueData", params, this, false); }	}
			
	return this.getConditionFunction(wpprocess); }

/** 
 *
 * @type Function
 * @returns the condition function - must return true upon evaluation untill the process continues
 */
CaseManWPProcessStep__ReLoadData.prototype.getConditionFunction = function(wpprocess) {
	// the the attrib id of the process to provide a hook to the prcess here
	var output = wpprocess.getOutput();
	var waitForReload = output.getDoReload();
	if ("true" == waitForReload) {
		var stateId = wpprocess.getOutputStateId('ReloadDone');
		return new Function("return WP.CheckState('"+stateId+"', true);"); }
	else {
		return new Function("return true");	} }
		
/**
 * WPOutput.__ReLoadData web service success handler
 */
CaseManWPProcessStep__ReLoadData.prototype.onSuccess = function(dom, serviceName) {
	var msg = "CCaseManWPProcessStep__ReLoadData.prototype.onSuccess ";
	var process = this.getProcess();	
	if (doLog) do_Log(msg + " for " + process + " : " + dom.xml);
	WP.SetState(process, WPState.ds_DOM, dom);
	WP.SetState(process, WPState.ds_DOM_Reload_Ready, true); }

/**
 * CaseManWPProcessStep__ReLoadData web service business expcetion handler
 */
CaseManWPProcessStep__ReLoadData.prototype.onBusinessException = function(exception) {
	WPError.ReportStepServiceError(this, exception);}

/**
 * CaseManWPProcessStep__ReLoadData web service system expcetion handler
 */
CaseManWPProcessStep__ReLoadData.prototype.onSystemException = function(exception)  {
	WPError.ReportStepServiceError(this, exception); }

/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to transform all data sourced from the app
 * into the wp variables xphats structure.
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__TransformData() {
	CaseManWPProcessStep.apply(this,["TransformData"]); 
}

/**
 *
 */
CaseManWPProcessStep__TransformData.prototype = new CaseManWPProcessStep();

/**
 *
 */
CaseManWPProcessStep__TransformData.prototype.constructor = CaseManWPProcessStep__TransformData;

CaseManWPProcessStep__TransformData.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg = "CaseManWPProcessStep__TransformData.prototype.process " + wpprocess;
	var output = wpprocess.getOutput();	
	var params = new NonFormServiceParams();
	params.addSimpleParameter('output', '' + output.getCJRReference());
	params.addSimpleParameter('outputUniqueID', '' + output.getUniqueId());
	var xml = WP.GetState(wpprocess, 'dsDOM');

	if (null != xml) {
		var ds = xml.selectSingleNode("/params/param[@name='xml']/ds");
		var id = xml.selectSingleNode("/params/param[@name='xml']/JudgementId");
		var ce = xml.selectSingleNode("/params/param[@name='xml']/COEventSeq");
		var sn = xml.selectSingleNode("/params/param[@name='xml']/DebtSequence");
		var ev = xml.selectSingleNode("/params/param[@name='xml']/eventxml/CaseEvent");
		var jd = xml.selectSingleNode("/params/param[@name='xml']/judgementxml/ds/MaintainJudgment");
		var ob = xml.selectSingleNode("/params/param[@name='xml']/obligationxml/ds/MaintainObligations");
		
		var coes = xml.selectSingleNode("/params/param[@name='xml']/COES");
		
		ds.appendChild(id);
		if (null != sn) ds.appendChild(sn);
		if (null != ce) ds.appendChild(ce);
		if (null != ev) ds.appendChild(ev);
		if (null != jd) ds.appendChild(jd);
		if (null != ob) ds.appendChild(ob);
		if (null != coes) ds.appendChild(coes);
		
		dom = WPS.createDOM(null,null,null);
		dom.loadXML(ds.xml);
		params.addDOMParameter('xml', dom); //dom
		var caseNumberNode = dom.selectSingleNode(CaseManWPXPath.dsDOM_ManageCase + '/' + CaseManWPXPath.dsDOM_CaseNumber);
		if (null != caseNumberNode) params.addSimpleParameter('caseNumber', WPS.getNodeTextContent(caseNumberNode));
		var coNumberNode = dom.selectSingleNode(CaseManWPXPath.dsDOM_MaintainCO + '/' + CaseManWPXPath.dsDOM_CONumber);
		if (null != caseNumberNode) params.addSimpleParameter('coNumber', WPS.getNodeTextContent(caseNumberNode));
	}
	else {
		msg += " (no xml supplied!) "; }
	xml1=null;
	msg += " loading data using the getNoticeOfIssueTransformData service mapping, ";	
	var xml2 = WP.GetState(wpprocess, 'qaDOM');
	if (null != xml2) {
		params.addDOMParameter('vardata', xml2);
		msg += " variable data dom supplied."; }
	else {
		msg += " no variabledata dom supplied."; }
	if (doLog) do_Log(msg);
	WPS.callService("getNoticeOfIssueTransformedData", params, this, false); 
	return this.getConditionFunction(wpprocess);
}

/** 
 *
 * @type Function
 * @returns the condition function - must return true upon evaluation untill the process continues
 */
CaseManWPProcessStep__TransformData.prototype.getConditionFunction = function(wpprocess) {
	// the the attrib id of the process to provide a hook to the prcess here
	var output = wpprocess.getOutput();
	var stateId = wpprocess.getOutputStateId('txDONE');
	return new Function("return WP.CheckState('"+stateId+"', true);"); }
	
/**
 * CaseManWPProcessStep__TransformData web service success handler
 */
CaseManWPProcessStep__TransformData.prototype.onSuccess = function(dom, serviceName) {
	var msg = "CaseManWPProcessStep__TransformData.prototype.onSuccess ";
	var process = this.getProcess();
	if (doLog) do_Log(msg+" "+process+" starts");
	WP.SetState(process, WPState.tx_DOM, dom);   
	WP.SetState(process, WPState.tx_DOM_Ready,true);   
	if (doLog) do_Log(msg+" "+process+" ENDS"); }

/**
 * CaseManWPProcessStep__TransformData web service business expcetion handler
 */
CaseManWPProcessStep__TransformData.prototype.onBusinessException = function(exception) {
	WPError.ReportStepServiceError(this, exception);}

/**
 * CaseManWPProcessStep__TransformData web service system expcetion handler
 */
CaseManWPProcessStep__TransformData.prototype.onSystemException = function(exception)  {
	WPError.ReportStepServiceError(this, exception); }



/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to store all output data sourced.
 *
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__StoreData() {
	CaseManWPProcessStep.apply(this,["StoreData"]); 
}

/**
 *
 */
CaseManWPProcessStep__StoreData.prototype = new CaseManWPProcessStep();

/**
 *
 */
CaseManWPProcessStep__StoreData.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg 		= "CaseManWPProcessStep__StoreData.prototype.process ";
	var output 		= wpprocess.getOutput();
	var request 	= wpprocess.getRequest();
	var context 	= request.getContext();
	var txDOM 		= WP.GetState(wpprocess,"txDOM");
	var txXML		= txDOM.selectSingleNode("/params/param[@name='xml']/*").xml;	
	var storeDOM 	= WPS.createDOM(null,null,null);
	storeDOM.loadXML(txXML);
	var vd = storeDOM.selectSingleNode("/variabledata");
	vd.appendChild(context.documentElement.cloneNode(true));
	var params 		= new NonFormServiceParams();
	params.addSimpleParameter('output', '' + output.getCJRReference());
	params.addSimpleParameter('outputUniqueID', '' + output.getUniqueId());
	params.addSimpleParameter('storingUser', '' + WPS.GetUserName());
	params.addDOMParameter('xml',storeDOM );
	var contextDOM 	= WPS.createDOM(null,null,null);
	contextDOM.loadXML(context.xml);
	params.addDOMParameter('context', contextDOM);
	WPS.callService("setNoticeOfIssueData", params, this, false); 
	if (doLog) do_Log(msg + "Storing Data");
	return this.getConditionFunction(wpprocess); }
	
/** 
 *
 * @type Function
 * @returns the condition function - must return true upon evaluation untill the process continues
 */
CaseManWPProcessStep__StoreData.prototype.getConditionFunction = function(wpprocess) {
	// the the attrib id of the process to provide a hook to the prcess here
	var stateId = wpprocess.getOutputStateId(WPState.st_DOM_Ready);
	return new Function("return WP.CheckState('"+stateId+"', true);"); }
	
/**
 *
 */
CaseManWPProcessStep__StoreData.prototype.constructor = CaseManWPProcessStep__StoreData;
	
/**
 * CaseManWPProcessStep__StoreData web service success handler
 */
CaseManWPProcessStep__StoreData.prototype.onSuccess = function(dom, serviceName) {
	var msg = "CaseManWPProcessStep__StoreData.prototype.onSuccess ";
	var process = this.getProcess();	
	var output = process.getOutput();	
	var resultIdNode = dom.selectSingleNode(CaseManWPXPath.OutputServerIDAfterCreation);
	var resultId = WPS.getNodeTextContent(resultIdNode);
	output.setServerId(resultId);	
	if (doLog) do_Log(msg + " for " + process + " : " + dom.xml);
	WP.SetState(process, WPState.st_DOM, dom);
	WP.SetState(process, WPState.st_DOM_Ready, true); }

/**
 * CaseManWPProcessStep__StoreData web service business expcetion handler
 */
CaseManWPProcessStep__StoreData.prototype.onBusinessException = function(exception) {
	WPError.ReportStepServiceError(this, exception);}

/**
 * CaseManWPProcessStep__StoreData web service system expcetion handler
 */
CaseManWPProcessStep__StoreData.prototype.onSystemException = function(exception)  {
	WPError.ReportStepServiceError(this, exception); }


/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to load the editor for the output
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__LoadEditor() {
	CaseManWPProcessStep.apply(this,["LoadEditor"]); 
}

/**
 *
 */
CaseManWPProcessStep__LoadEditor.prototype = new CaseManWPProcessStep();

/**
 *
 */
CaseManWPProcessStep__LoadEditor.prototype.constructor = CaseManWPProcessStep__LoadEditor;

/**
 *
 */
CaseManWPProcessStep__LoadEditor.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg = "CaseManWPProcessStep__LoadEditor.prototype.process ";
	if (doLog) do_Log(msg+"starts");
	if (wpprocess.mayEditOutputNow()) {
		var output = wpprocess.getOutput();			
		var txDOM = WP.GetState(wpprocess,"txDOM");
		var params = new NonFormServiceParams();
		params.addSimpleParameter('reportType', 'WP' );
		var dom = XML.createDOM();
		
		var x = txDOM.selectSingleNode("/params/param[@name='xml']/*");
		if (null != x)
		{
			dom.loadXML(x.xml);
		}
		else
		{
			dom = txDOM;
		}
		params.addDOMParameter('xml', dom);
		params.addSimpleParameter('outputXhtmlXsl', output.getXSLXHTMLUrl());
		WPS.callService("getXhtml", params, this, false); }
	if (doLog) do_Log(msg+"ends");
	return this.getConditionFunction(wpprocess); }

/** 
 *
 */
CaseManWPProcessStep__LoadEditor.prototype.getConditionFunction = function(wpprocess) {
	if (wpprocess.mayEditOutputNow()) {
		var stateId = wpprocess.getOutputStateId(WPState.wpl_DOM_Ready);
		return new Function("return WP.CheckState('"+stateId+"', true);"); }
	else {
		return new Function("return true"); } }
	
/**
 * CaseManWPProcessStep__LoadEditor web service success handler
 */
CaseManWPProcessStep__LoadEditor.prototype.onSuccess = function(dom, serviceName) {
	var msg = "CaseManWPProcessStep__LoadEditor.prototype.onSuccess ";
	var process = this.getProcess();
	if (doLog) do_Log(msg+" "+process+" starts");
	WPS.NavigateTo("WPEditor");		
	WP.SetState(process, WPState.wpl_DOM, dom);   
	WP.GetInstance("CaseManWPCtrl").setScreenProcess(process);
	if (doLog) do_Log(msg+" "+process+" ENDS"); }

/**
 * CaseManWPProcessStep__LoadEditor web service business expcetion handler
 */
CaseManWPProcessStep__LoadEditor.prototype.onBusinessException = function(exception) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * CaseManWPProcessStep__LoadEditor web service system expcetion handler
 */
CaseManWPProcessStep__LoadEditor.prototype.onSystemException = function(exception)  {
	WPError.ReportStepServiceError(this, exception);}




/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to save the editor for the output
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__SaveEditor() {
	CaseManWPProcessStep.apply(this,["SaveEditor"]); 
}

/**
 *
 */
CaseManWPProcessStep__SaveEditor.prototype = new CaseManWPProcessStep();

/**
 *
 */
CaseManWPProcessStep__SaveEditor.prototype.constructor = CaseManWPProcessStep__SaveEditor;

/**
 *
 */
CaseManWPProcessStep__SaveEditor.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg = "CaseManWPProcessStep__SaveEditor.prototype.process ";
	if (wpprocess.mayEditOutputNow()) {
		var output = wpprocess.getOutput();
		var request 	= wpprocess.getRequest();
		var context 	= request.getContext();
		var wpDOM 		= WP.GetState(wpprocess,"wpDOM");
		var txDOM 		= WP.GetState(wpprocess,"txDOM");
		var finalFlag	= WP.GetState(wpprocess, WPState.wps_FIN);
		var vdNode 		= txDOM.selectSingleNode("/params/param[@name='xml']/variabledata");
		var vdXHTML 	= txDOM.selectSingleNode("/params/param[@name='xml']/variabledata/xhtml");		
		var finalNode = txDOM.createElement("outputIsFinal");
			finalNode.appendChild(txDOM.createTextNode(""+finalFlag));			
			vdNode.appendChild(finalNode);		
		if (null != wpDOM && null != wpDOM.documentElement) {
			vdXHTML.appendChild(wpDOM.documentElement); }
		WP.SetState(wpprocess, WPState.wps_DOM_Ready, true); }
	return this.getConditionFunction(wpprocess); }

/** 
 *
 */
CaseManWPProcessStep__SaveEditor.prototype.getConditionFunction = function(wpprocess) {
	if (wpprocess.mayEditOutputNow()) {
		var stateId = wpprocess.getOutputStateId('WPSaveDone');
		return new Function("return WP.CheckState('"+stateId+"', true);"); }
	else {
		return new Function("return true"); } }
		
/**
 * CaseManWPProcessStep__SaveEditor web service success handler
 */
CaseManWPProcessStep__SaveEditor.prototype.onSuccess = function(dom, serviceName) {
	var msg = "CaseManWPProcessStep__SaveEditor.prototype.onSuccess";
	var process = this.getProcess();
	if (doLog) do_Log(msg+" "+process+" starts");
	WP.SetState(process, WPState.wps_DOM_Ready, true);   
	WP.SetState(process, WPState.wps_DOM, dom);   
	if (doLog) do_Log(msg+" "+process+" ENDS"); }

/**
 * CaseManWPProcessStep__SaveEditor web service business expcetion handler
 */
CaseManWPProcessStep__SaveEditor.prototype.onBusinessException = function(exception) {
	WPError.ReportStepServiceError(this, exception);}

/**
 * CaseManWPProcessStep__SaveEditor web service system expcetion handler
 */
CaseManWPProcessStep__SaveEditor.prototype.onSystemException = function(exception)  {
	WPError.ReportStepServiceError(this, exception); }
				
				

/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to load the output as PDF
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__ViewPDF() {
	CaseManWPProcessStep.apply(this,["ViewPDF"]); 
}

/**
 *
 */
CaseManWPProcessStep__ViewPDF.prototype = new CaseManWPProcessStep();

/**
 *
 */
CaseManWPProcessStep__ViewPDF.prototype.constructor = CaseManWPProcessStep__ViewPDF;

/**
 * The current ViewPDF functionality uses the WPPrintApplet solution.
 */
CaseManWPProcessStep__ViewPDF.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg = "CaseManWPProcessStep__ViewPDF.prototype.process ";
	var output = wpprocess.getOutput();
	var	cfg = "location=no,menubar=no,status=yes,toolbar=no,resizable=1,left=0,top=0,width=800,height=812";
	var win = window.open("about:blank","SUPSPDFWindow"+(wpctrl.pdfwindowcount++),cfg, true);
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
	return this.getConditionFunction(wpprocess); }
	
/** 
 *
 * @type Function
 * @returns the condition function - must return true upon evaluation untill the process continues
 */
CaseManWPProcessStep__ViewPDF.prototype.getConditionFunction = function(wpprocess) {
	// the the attrib id of the process to provide a hook to the prcess here
	//var stateId = wpprocess.getOutputStateId('ViewPDF');
	//return new Function("return WP.CheckState('"+stateId+"', true);"); }
	return new Function("return true"); }
	
/**
 * CaseManWPProcessStep__ViewPDF web service success handler
 */
CaseManWPProcessStep__ViewPDF.prototype.onSuccess = function(dom, serviceName) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * CaseManWPProcessStep__ViewPDF web service business expcetion handler
 */
CaseManWPProcessStep__ViewPDF.prototype.onBusinessException = function(exception) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * CaseManWPProcessStep__ViewPDF web service system expcetion handler
 */ 
CaseManWPProcessStep__ViewPDF.prototype.onSystemException = function(exception)  {
	WPError.ReportStepServiceError(this, exception); }
								
								
								
								
/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to print preview the output
 * in CaseMAN.
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__PrintPreview() {
	CaseManWPProcessStep.apply(this,["PrintPreview"]); 
}

/**
 *
 */
CaseManWPProcessStep__PrintPreview.prototype = new CaseManWPProcessStep();

/**
 *
 */
CaseManWPProcessStep__PrintPreview.prototype.constructor = CaseManWPProcessStep__PrintPreview;

/**
 *
 */
CaseManWPProcessStep__PrintPreview.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg = "CaseManWPProcessStep__PrintPreview.prototype.process ";
	var output = wpprocess.getOutput();
	// store the data
	alert(msg)
	WP.SetState(wpprocess,"PrintPreDone",true);
	return this.getConditionFunction(wpprocess); }

/** 
 *
 */
CaseManWPProcessStep__PrintPreview.prototype.getConditionFunction = function(wpprocess) {
	// the the attrib id of the process to provide a hook to the prcess here
	var stateId = wpprocess.getOutputStateId('PrintPreDone');
	return new Function("return WP.CheckState('"+stateId+"', true);"); }
	
/**
 * CaseManWPProcessStep__PrintPreview web service success handler
 */
CaseManWPProcessStep__PrintPreview.prototype.onSuccess = function(dom, serviceName) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * CaseManWPProcessStep__PrintPreview web service business expcetion handler
 */
CaseManWPProcessStep__PrintPreview.prototype.onBusinessException = function(exception) {
	WPError.ReportStepServiceError(this, exception);}

/**
 * CaseManWPProcessStep__PrintPreview web service system expcetion handler
 */ 
CaseManWPProcessStep__PrintPreview.prototype.onSystemException = function(exception)  {
	WPError.ReportStepServiceError(this, exception); }
																
																																																															
/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to print the output as per 'default'
 * in CaseMAN.
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__Print_DEFAULT() {
	CaseManWPProcessStep.apply(this,["Print_DEFAULT"]); 
}

/**
 *
 */
CaseManWPProcessStep__Print_DEFAULT.prototype = new CaseManWPProcessStep();

/**
 *
 */
CaseManWPProcessStep__Print_DEFAULT.prototype.constructor = CaseManWPProcessStep__Print_DEFAULT;

/**
 *
 */
CaseManWPProcessStep__Print_DEFAULT.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg = "CaseManWPProcessStep__Print_DEFAULT.prototype.process ";
	var output = wpprocess.getOutput();
	// store the data
	alert(msg)
	WP.SetState(wpprocess,WPState.wpp_Ready,true);
	return this.getConditionFunction(wpprocess); }

/** 
 *
 */
CaseManWPProcessStep__Print_DEFAULT.prototype.getConditionFunction = function(wpprocess) {
	// the the attrib id of the process to provide a hook to the prcess here
	var stateId = wpprocess.getOutputStateId('PrintDone');
	return new Function("return WP.CheckState('"+stateId+"', true);"); }
		
/**
 * CaseManWPProcessStep__Print_DEFAULT web service success handler
 */
CaseManWPProcessStep__Print_DEFAULT.prototype.onSuccess = function(dom, serviceName) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * CaseManWPProcessStep__Print_DEFAULT web service business expcetion handler
 */
CaseManWPProcessStep__Print_DEFAULT.prototype.onBusinessException = function(exception) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * CaseManWPProcessStep__Print_DEFAULT web service system expcetion handler
 */ 
CaseManWPProcessStep__Print_DEFAULT.prototype.onSystemException = function(exception)  {
	WPError.ReportStepServiceError(this, exception); }

							
/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to clean up the output process
 * in CaseMAN.
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__CleanUp() {
	CaseManWPProcessStep.apply(this,["Cleanup"]); 
}

/**
 *
 */
CaseManWPProcessStep__CleanUp.prototype = new CaseManWPProcessStep();

/**
 *
 */
CaseManWPProcessStep__CleanUp.prototype.constructor = CaseManWPProcessStep__CleanUp;

/**
 *
 */
CaseManWPProcessStep__CleanUp.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg = "CaseManWPProcessStep__CleanUp.prototype.process ";
	var output = wpprocess.getOutput();
	if (doLog) do_Log(msg + " for output: " + output);
	var doRedirection = true == wpprocess.getAlwaysCallback() || ( "true" == output.getDoQA() && "Open" != wpprocess.getName() && "Print" != wpprocess.getName()) || wpprocess.mayEditOutputNow(output);
	if (doLog) {
		do_Log(msg + "doRedirection: " + doRedirection);
		do_Log(msg + "wpprocess.getAlwaysCallback(): " + wpprocess.getAlwaysCallback());
		do_Log(msg + "output.getDoQA(): " + output.getDoQA());
		do_Log(msg + "output.getDoWP(): " + output.getDoWP()); }
	if (doRedirection) {
		if (doLog) do_Log(msg + "wpprocess.getCallback(): " + wpprocess.getCallback());
		WPS.NavigateTo(wpprocess.getCallback()); }	
	top.WPCtrl.ClearState(wpprocess);
	
	top.WPCtrl.CaseManWPDIDSOMETHING = true;
	top.WPCtrl.CaseManORADIDSOMETHING = false;
	
	return this.getConditionFunction(wpprocess); }

/** 
 *
 */
CaseManWPProcessStep__CleanUp.prototype.getConditionFunction = function(wpprocess) {
	// the the attrib id of the process to provide a hook to the prcess here
	return new Function("return true"); }
		
/**
 * CaseManWPProcessStep__CleanUp web service success handler
 */
CaseManWPProcessStep__CleanUp.prototype.onSuccess = function(dom, serviceName) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * CaseManWPProcessStep__CleanUp web service business expcetion handler
 */
CaseManWPProcessStep__CleanUp.prototype.onBusinessException = function(exception) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * CaseManWPProcessStep__CleanUp web service system expcetion handler
 */ 
CaseManWPProcessStep__CleanUp.prototype.onSystemException = function(exception)  {
	WPError.ReportStepServiceError(this, exception); }						
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
/**
 * WPOutput Step OpenOutput Class - Interface with Server side data loading
 *
 *
 * @constructor
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__OpenOutput() {
	CaseManWPProcessStep.apply(this,["OpenOutput"]); }

/**
 *
 */
CaseManWPProcessStep__OpenOutput.prototype = new CaseManWPProcessStep();

/**
 *
 */
CaseManWPProcessStep__OpenOutput.prototype.constructor = CaseManWPProcessStep__OpenOutput;

/**
 * 
 * @argument wpctrl
 * @argument wpprocess
 */
CaseManWPProcessStep__OpenOutput.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg = "CaseManWPProcessStep__OpenOutput.prototype.process";
	
	
	var outputId = WP.GetContextValue(wpprocess.getRequest().getContext(), CaseManWPXPath.ctxWPOutputId);
	wpprocess.getOutput().setServerId(outputId);
	
	var dom = XML.createDOM();
	if (dom.load(CaseManWPXPath.URLPDFCreation + "?outputAction=LOADXHTML&outputXsl=xxx&UniqueId="+outputId))
	{
		WP.SetState(wpprocess,"txDOM", dom);
	}

	
	return this.getConditionFunction(wpprocess); }

/** 
 *
 */
CaseManWPProcessStep__OpenOutput.prototype.getConditionFunction = function(wpprocess) {
	//var stateId = wpprocess.getOutputStateId(WPState.ooo_Ready);
	//return new Function("return WP.CheckState('"+stateId+"', true);");}
	return new Function("return true;"); }

/**
 * WPOutput.__LoadData web service success handler
 */
CaseManWPProcessStep__OpenOutput.prototype.onSuccess = function(dom, serviceName) {
	var msg = "CaseManWPProcessStep__OpenOutput.prototype.onSuccess ";
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
 * CaseManWPProcessStep__OpenOutput web service business expcetion handler
 */
CaseManWPProcessStep__OpenOutput.prototype.onBusinessException = function(exception) {
	WPError.ReportStepServiceError(this, exception);}

/**
 * CaseManWPProcessStep__OpenOutput web service system expcetion handler
 */
CaseManWPProcessStep__OpenOutput.prototype.onSystemException = function(exception)  {
	WPError.ReportStepServiceError(this, exception);}

	