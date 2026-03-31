/**
 * SUPS CaseMan Word Processing Process class
 * Assistant class for processes/process steps in Word Processing.
 * The process/step composition is parsed from the wpctrl configuration xml.
 *
 * Change History
 * 05/12/2012 - Chris Vincent: Bulk Printing changes (Trac 4761)
 * LoadData - checks for Welsh indicator or Duplicate Notice indicator and turns off bulk printing accordingly
 * LoadOldData - checks for Welsh indicator and turns off bulk printing accordingly
 * SetDocument - Send the nreference and bulk print indicator to the setDocument service 
 * 12/10/2016  Chris Vincent: bulk printing changes to ensure outputs on Family Enforcement cases are not
 *			   bulk printed.  Trac 5883
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
 * @returns the name of the user's default printer
 */
CaseManWPProcess.prototype.getDefaultPrinter = function() {
	var printer = "";
	var dsDom = WP.GetState(this, WPState.ds_DOM);
	if (null != dsDom) {
		var printerNode = dsDom.selectSingleNode(CaseManWPXPath.defaultPrinter);
		if (null != printerNode) {	
			printer = WPS.getNodeTextContent(printerNode); }
		else {
			printerNode = dsDom.selectSingleNode("/params/param/UserDetails/ds/MaintainUser/DefaultPrinter");
			if (null != printerNode) {	
				printer = WPS.getNodeTextContent(printerNode); }
			else {
				alert("Unable to identify the default printer"); } } }
	return printer; }

/**
 * 
 */
CaseManWPProcess.prototype.getDuplexSetting = function(defaultSetting) {
	var output = this.getOutput();
	if (null != output) {
		var duplexSetting = output.getDuplexSetting();
		return duplexSetting; }
	else {
		return defaultSetting; } }
		
/**
 * 
 */
CaseManWPProcess.prototype.getTraySetting = function(defaultSetting) {
	var output = this.getOutput();
	if (null != output) {
		var setting = output.getTraySetting();
		return setting; }
	else {
		return defaultSetting; } }
/**
 * 
 */
CaseManWPProcess.prototype.getCopiesSetting = function(defaultSetting) {
	var output = this.getOutput();
	if (null != output) {
		var setting = output.getCopiesSetting();
		return setting; }
	else {
		return defaultSetting; } }

/**
 *
 */
CaseManWPProcess.prototype.getFAPServer = function() {
	var server = "";
	var dsDom = WP.GetState(this, WPState.ds_DOM);
	if (null != dsDom) {
		var serverNode = dsDom.selectSingleNode(CaseManWPXPath.FAPServer);
		if (null != serverNode) {	
			server = WPS.getNodeTextContent(serverNode); }
		else {
			alert("Unable to identify the default FAPServer"); } }
	return server;	}

/**
 * SUPS CaseMan Word Processing Process 
 * @type String
 * @returns string representation of this WPProcess
 */
CaseManWPProcess.prototype.toString = function() {
	return "CaseMan WPProcess " + this.name; }

/**
 * SUPS CaseMan Word Processing function assisting with determining whether this process's output is editable.
 * This function considers the xml wp configuration <WP>[true|false]</WP>, and the output's final flag.
 * @returns boolean
 */
CaseManWPProcess.prototype.mayEditOutputNow = function() {
	var msg = "CaseManWPProcess.prototype.mayEditOutputNow ";
	var val = false;
	var processName = this.getName();
	var output = this.getOutput();
	if ("true" == output.getDoWP()) {
		if ("Open" == processName) {
			var finalOutputNode = this.getRequest().getContext().selectSingleNode("/WordProcessing/Final");
			var finalOutputValue = WPS.getNodeTextContent(finalOutputNode);
			if ("Y" != finalOutputValue) {
				val = true; } }
		else if ("Create" == processName) {
			val = true; } }	
	if (doLog) do_Log(msg+" returns: " + val);	
	return val; }
	
/**
 * SUPS CaseMan Word Processing function assisting with determining whether this process's output is editable.
 * This function considers the xml wp configuration <WP>[true|false]</WP>, and the output's final flag.
 * @returns boolean
 */
CaseManWPProcess.prototype.mustCreateReportNow = function() {
	var msg = "CaseManWPProcess.prototype.mustCreateReportNow ";
	var val = false;
	var processName = this.getName();
	var output = this.getOutput();
	if ("true" == output.getDoWP()) {
		if ("Open" == processName) {
			var finalOutputNode = this.getRequest().getContext().selectSingleNode("/WordProcessing/Final");
			var finalOutputValue = WPS.getNodeTextContent(finalOutputNode);
			if ("Y" != finalOutputValue) {
				val = true; } }
		else if ("Create" == processName) {
			val = true; } }	
	else {
		if ("Create" == processName) {
			val = true; } }
	if (doLog) do_Log(msg+" returns: " + val);	
	return val; }

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
			break; 
		case "QAOnly":
			request = new CaseManQAOnlyRequest(context, process );
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
  * @deprecated
 */
CaseManWPProcess.prototype.determineOutput = function(contextxml, process, wpctrl) {	
	var output = null;
	output = process.getRequest().FindOutputToProcess(contextxml, process, wpctrl, "CaseManWPOutput");
	return output; }

/**
 * SUPS CaseMan Word Processing Process 
 * @argument context contextxml
 * @type WPOutput
 * @argument contextxml xmldom
 * @argument process 	WPProcess
 * @argument wpctrl		WPCtrl
 * @returns array of output WPOutput
 */
CaseManWPProcess.prototype.determineOutputs = function(contextxml, process, wpctrl) {	
	var outputs = null;
	outputs = process.getRequest().FindOutputsToProcess(contextxml, process, wpctrl, "CaseManWPOutput");
	return outputs; }

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
	return "CaseManWPProcessStep " + this.name; }

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
	do_X("CaseManWPProcessStep.prototype.process() must be implemented by subclass"); }

/**
 * SUPS WOrd Processing Process Step getConfitionFunction
 * This function returns null or a function which returns a boolean indicating
 * whether it's ok to proceed with the next process step.
 * @type Function
 * @retuns function
 */
CaseManWPProcessStep.prototype.getConditionFunction = function() {
	do_X(this + " must implement the .prototype.getConditionFunction() method"); }

/**
 * SUPS CaseMan Word Processing Process Step - determine the request instance
 * for which a dom was returned by a web service call.
 * @argument context contextxml
 * @type WPRequest
 * @returns wprequest 
 */
CaseManWPProcessStep.determineRequest = function(dom) {	
	var request = null;
	/** analyze dom and get id and find object instance... **/
	return request;	}

/**
 * CaseManWPProcessStep web service business expcetion handler
 */
CaseManWPProcessStep.prototype.onBusinessException = function(exception) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * CaseManWPProcessStep web service system expcetion handler
 */
CaseManWPProcessStep.prototype.onSystemException = function(exception)  {
	WPError.ReportStepServiceError(this, exception); }

CaseManWPProcessStep.ProgressBarRaised = false;

		
CaseManWPProcessStep.RaiseProgressBar = function() {
	var msg = "CaseManWPProcessStep.RaiseProgressBar ";
	if (!CaseManWPProcessStep.ProgressBarRaised) {
		if (doLog) do_Log(msg+" raising");
		try {
			WPS.dispatchEvent("ProgressBar_SubForm", PopupGUIAdaptor.EVENT_RAISE);
			CaseManWPProcessStep.ProgressBarRaised = true; }
		catch (err) {
			if (doLog) do_Log(msg+" ERR :" + err); 	} }
	else {
		if (doLog) do_Log(msg+" not raising at its raised"); }
	if (doLog) do_Log(msg+" raised"); }
	
/**
 *
 */
CaseManWPProcessStep.LowerProgressBar = function(process) {
	var msg = "CaseManWPProcessStep.LowerProgressBar ";
	if (CaseManWPProcessStep.ProgressBarRaised) {
		if (doLog) do_Log(msg+" lowering");
		try {
			WPS.dispatchEvent("ProgressBar_SubForm", PopupGUIAdaptor.EVENT_LOWER); 
			WP.SetState(process, "ProgressBarUp", false);
			CaseManWPProcessStep.ProgressBarRaised = false; }
		catch(err) {
			if (doLog) do_Log(msg+" ERR :" + err); 	} }
	else {
		if (doLog) do_Log(msg+" not lowering - its said not to be raised"); } }

/**
 *
 */
CaseManWPProcessStep.MakeProgressBarProgress = function() {
	var msg = "CaseManWPProcessStep.MakeProgressBarProgress ";
	var xpath = CaseManWPXPath.ProgressBar;
	var val = WPS.getValue(xpath);
	val = (null == val) ? "" : (val + "|");
	WPS.setValue(xpath, val);	
	if (doLog) do_Log(msg+val); }

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
	this.preprocess(wpctrl, wpprocess);
	var msg = "CaseManWPProcessStep__LoadData.prototype.process ";
	var params = new NonFormServiceParams();
	var output = wpprocess.getOutput();
	if (null != output) {
		CaseManWPProcessStep.RaiseProgressBar();
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
		
		/** 
		 * If the output has been marked for bulk printing but there is a party on the case who has requested translation
		 * to Welsh, turn off bulk printing and alert the user will be printed locally.  Bulk Printing also turned off if
		 * producing a Duplicate Notice of Issue.  Trac 4761
		 */
		if (output.getDoBulkPrint()) {
			var welshIndNode = contextxml.selectSingleNode("/WordProcessing/Case/WelshTranslation");
			var duplicateNode = contextxml.selectSingleNode("/WordProcessing/Event/Duplicate");
			var jurisdictionNode = contextxml.selectSingleNode("/WordProcessing/Case/Jurisdiction");
			var welshIndText = "N";
			var jurisdictionText = "ALL";
			var duplicateText = "false";
			if (null != welshIndNode) { welshIndText = welshIndNode.text; }
			if (null != jurisdictionNode) { jurisdictionText = jurisdictionNode.text; }
			if (null != duplicateNode) { duplicateText = duplicateNode.text; }
			if (welshIndText == "Y") {
				output.setDoBulkPrint(false);
				alert("A party associated with this case has requested a Welsh language translation of outputs created.\n"
					+ "As such, the output has not been automatically sent for Bulk Printing and will be printed locally.");
			}
			else if (jurisdictionText == "F") {
				output.setDoBulkPrint(false);
				alert("This case is a family enforcement case.\n"
					+ "As such, the output has not been automatically sent for Bulk Printing and will be printed locally.");
			}
			else if (duplicateText == "true") {
					output.setDoBulkPrint(false);					
			} 
		} 
		WPS.callService("getNoticeOfIssueData", params, this, false, false); 
	}	
	return this.getConditionFunction(wpprocess); }

/** 
 *
 */
CaseManWPProcessStep__LoadData.prototype.getConditionFunction = function(wpprocess) {
	var dataLoaded = wpprocess.getOutputStateId(WPState.ds_DOM_Ready);
	var progressBarUp = wpprocess.getOutputStateId(WPState.ProgressBarUp);
	return new Function("return WP.CheckState('"+dataLoaded+"', true) && WP.CheckState('"+progressBarUp+"', true);"); }

CaseManWPProcessStep__LoadData.prototype.getQAHeaderPartiesAndNumberOfCase = function(caseNode, parties) {
	var numberNode = caseNode.selectSingleNode(CaseManWPXPath.dsDOM_CaseNumber);
	var number = "";
	if (null != numberNode) number = WPS.getNodeTextContent(numberNode);
	var partyNodes = caseNode.selectNodes(CaseManWPXPath.dsDOM_CaseParties);
	var noOfParties = partyNodes.length;
	for(var i=0; i<noOfParties; i++) {
		var party = partyNodes[i]
		parties.push(party); } 
	return number; }
		
CaseManWPProcessStep__LoadData.prototype.getQAHeaderPartiesAndNumberOfCO = function(CONode, parties) { 
	var numberNode = CONode.selectSingleNode(CaseManWPXPath.dsDOM_CONumber);
	var number = "";
	if (null != numberNode) number = WPS.getNodeTextContent(numberNode);
	var debtorNode = CONode.selectSingleNode(CaseManWPXPath.dsDOM_CODebtor);
	var debtorNameNode = CONode.selectSingleNode(CaseManWPXPath.dsDOM_CODebtorName);
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
	var employerNode = CONode.selectSingleNode(CaseManWPXPath.dsDOM_COEmployer);
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
	var partyNodes = CONode.selectNodes(CaseManWPXPath.dsDOM_COCreditor);
	var noOfParties = partyNodes.length;
	for(var i=0; i<noOfParties; i++) {
		var party = partyNodes[i]
		partyType = party.ownerDocument.createElement("PartyType");
		partyType.appendChild(party.ownerDocument.createTextNode(CMC.PartyTypeCodesEnum.CREDITOR));
		party.appendChild(partyType);
		partyType2 = party.ownerDocument.createElement("Type");
		partyType2.appendChild(party.ownerDocument.createTextNode("Creditor"));
		party.appendChild(partyType2);
		parties.push(party); } 
	return number; }

CaseManWPProcessStep__LoadData.prototype.getQAHeaderPartiesAndNumberOfWarrant = function(WarrantNode, parties) {
	var numberNode = WarrantNode.selectSingleNode(CaseManWPXPath.dsDOM_WarrantCaseNumber);
	var number = "";
	if (null != numberNode) number = WPS.getNodeTextContent(numberNode);		
	var claimantNode = WarrantNode.selectSingleNode(CaseManWPXPath.dsDOM_WarrantClaimant);
	if (null != claimantNode) claimantNode = claimantNode.cloneNode(true);
	var claimantNameNode = WarrantNode.selectSingleNode(CaseManWPXPath.dsDOM_WarrantClaimantName);
	var claimantName = null != claimantNameNode ? WPS.getNodeTextContent(claimantNameNode) : "n/a";
	var claimantId = 1
	var claimantIdNode = claimantNode.ownerDocument.createElement("PartyId");
	claimantIdNode.appendChild(claimantNode.ownerDocument.createTextNode(claimantId));
	var partyType = claimantNode.selectSingleNode("PartyType");
	if (null != partyType) claimantNode.removeChild(partyType);
	partyType = claimantNode.ownerDocument.createElement("PartyType");
	partyType.appendChild(claimantNode.ownerDocument.createTextNode(CMC.PartyTypeCodesEnum.CLAIMANT));
	var partyType3 = claimantNode.ownerDocument.createElement("TypeCode");
	partyType3.appendChild(claimantNode.ownerDocument.createTextNode(CMC.PartyTypeCodesEnum.CLAIMANT));
	var partyType2 = claimantNode.ownerDocument.createElement("Type");
	partyType2.appendChild(claimantNode.ownerDocument.createTextNode("Claimant"));
	claimantNode.appendChild(claimantNameNode.cloneNode(true));
	claimantNode.appendChild(claimantIdNode);
	claimantNode.appendChild(partyType);
	claimantNode.appendChild(partyType2);
	claimantNode.appendChild(partyType3);	
	parties.push(claimantNode);
	var defendant1Node = WarrantNode.selectSingleNode(CaseManWPXPath.dsDOM_WarrantDefendant1);
	if (null != defendant1Node) defendant1Node = defendant1Node.cloneNode(true);
	var defendant1NameNode = WarrantNode.selectSingleNode(CaseManWPXPath.dsDOM_WarrantDefendant1Name);
	var defendant1Name = null != defendant1NameNode ? WPS.getNodeTextContent(defendant1NameNode) : "n/a";
	var defendant1Id = 2;
	var defendant1IdNode = defendant1Node.ownerDocument.createElement("PartyId");
	defendant1IdNode.appendChild(defendant1Node.ownerDocument.createTextNode(defendant1Id));
	var partyType = defendant1Node.selectSingleNode("PartyType");
	if (null != partyType) defendant1Node.removeChild(partyType); 
	partyType = defendant1Node.ownerDocument.createElement("PartyType");
	partyType.appendChild(defendant1Node.ownerDocument.createTextNode(CMC.PartyTypeCodesEnum.DEFENDANT));
	var partyType2 = defendant1Node.ownerDocument.createElement("Type");
	partyType2.appendChild(defendant1Node.ownerDocument.createTextNode("Defendant"));
	var partyType3 = defendant1Node.ownerDocument.createElement("TypeCode");
	partyType3.appendChild(defendant1Node.ownerDocument.createTextNode(CMC.PartyTypeCodesEnum.DEFENDANT));
	defendant1Node.appendChild(defendant1NameNode.cloneNode(true));
	defendant1Node.appendChild(defendant1IdNode);
	defendant1Node.appendChild(partyType);
	defendant1Node.appendChild(partyType2);
	defendant1Node.appendChild(partyType3);	
	parties.push(defendant1Node);
	var defendant2Node = WarrantNode.selectSingleNode(CaseManWPXPath.dsDOM_WarrantDefendant2);
	if (null != defendant2Node) defendant2Node = defendant2Node.cloneNode(true);
	var defendant2NameNode = WarrantNode.selectSingleNode(CaseManWPXPath.dsDOM_WarrantDefendant2Name);
	var defendant2Name = null != defendant2NameNode ? WPS.getNodeTextContent(defendant2NameNode) : "";
	if (null != defendant2Name && "" != defendant2Name) {
		var defendant2Id = 3;
		var defendant2IdNode = defendant2Node.ownerDocument.createElement("PartId");
		defendant2IdNode.appendChild(defendant2Node.ownerDocument.createTextNode(defendant2Id));
		var partyType = defendant2Node.selectSingleNode("PartyType");
		if (null != partyType) defendant2Node.removeChild(partyType);
		partyType = defendant2Node.ownerDocument.createElement("PartyType");
		partyType.appendChild(defendant2Node.ownerDocument.createTextNode(CMC.PartyTypeCodesEnum.DEFENDANT));
		var partyType3 = defendant2Node.ownerDocument.createElement("TypeCode");
		partyType3.appendChild(defendant2Node.ownerDocument.createTextNode(CMC.PartyTypeCodesEnum.DEFENDANT));
		var partyType2 = defendant2Node.ownerDocument.createElement("Type");
		partyType2.appendChild(defendant2Node.ownerDocument.createTextNode("Defendant"));
		defendant2Node.appendChild(defendant2NameNode.cloneNode(true));
		defendant2Node.appendChild(defendant2IdNode);
		defendant2Node.appendChild(partyType);
		defendant2Node.appendChild(partyType2);
		defendant2Node.appendChild(partyType3);	
		parties.push(defendant2Node); }					
	return number; }

/**
 * WPOutput.__LoadData web service success handler
 */
CaseManWPProcessStep__LoadData.prototype.onSuccess = function(dom, serviceName) {
	var msg = "CaseManWPProcessStep__LoadData.prototype.onSuccess ";
	var process = this.getProcess();
	if (doLog) do_Log(msg + " for " + process ); /** CAN BE VERY INEFFICIENT: + " : " + dom.xml**/
	var parties = new Array();
	var screentype = "";
	var number = "";
	var maintainWarrantNode = dom.selectSingleNode(CaseManWPXPath.dsDOM_MaintainWarrant);			
	if (null != maintainWarrantNode)  {
		screentype = "Warrant";	
		number = this.getQAHeaderPartiesAndNumberOfWarrant(maintainWarrantNode, parties); }
	else {
		var maintainCONode = dom.selectSingleNode(CaseManWPXPath.dsDOM_MaintainCO);
		if (null != maintainCONode) {
			screentype = "CO";	
			number = this.getQAHeaderPartiesAndNumberOfCO(maintainCONode, parties);  }
		else {		
			var maintainCaseNode = dom.selectSingleNode(CaseManWPXPath.dsDOM_ManageCase);
			if (null != maintainCaseNode) {
				screentype = "Case";	
				number = this.getQAHeaderPartiesAndNumberOfCase(maintainCaseNode, parties); }
			else {
				alert("Problem initialising parties for QA Screen"); } } }			
	WP.SetQA_ScreenType(screentype, process);
	WP.SetQA_HeaderNumber(number, process);
	WP.SetQA_HeaderParties(parties, process);
	WP.SetState(process, WPState.ds_DOM, dom);
	WP.SetState(process, WPState.ds_DOM_Ready, true); }

/**
 * this used to be done at the end of the evdscreen init,
 * now, at the end of the data loading and reloading
 */
CaseManWPProcessStep__LoadData.TransferUserDetails = function(process) {
	var minidom = WP.GetState(process, "dsDOM");
	var minidom2   = minidom.selectSingleNode("/params/param[@name='xml']/ds/ManageCase");
	var judgment   = minidom.selectSingleNode("/params/param[@name='xml']/judgementxml");
	var obligation = minidom.selectSingleNode("/params/param[@name='xml']/obligationxml");
	var evts       = minidom.selectSingleNode("/params/param[@name='xml']/eventxml");
	var S = WPS.__Services();	
	if (null!= minidom2) 	S.addNode(minidom2, "/ds");
	if (null!= judgment) 	S.addNode(judgment.selectSingleNode("./ds/MaintainJudgment"), "/ds/wp");
	if (null!= obligation) 	S.addNode(obligation.selectSingleNode("./ds/MaintainObligations"), "/ds/wp");
	if (null!= evts) 		S.addNode(evts.selectSingleNode("./*"), "/ds");
	var userName = WPU.getUserName();				if (doLog) do_Log("1"+userName);
	var userHomeCrtCode = WPU.getHomeCourtCode();	if (doLog) do_Log("2"+userHomeCrtCode);
	var userRoles = WPU.getUserRoles();				if (doLog) do_Log("3"+userRoles);
	var userExt = WPU.getUserTelephoneNumber();		if (doLog) do_Log("4"+userExt);
	var userSection = WPU.getCourtSection();		if (doLog) do_Log("5"+userSection);
	var userfullname = WPU.getUserFullname();		if (doLog) do_Log("6"+userfullname);
	var userPrinter = WPU.getUserDefaultPrinter();	if (doLog) do_Log("7"+userPrinter);
	var userDOM = XML.createDOM(); 
	userDOM.loadXML("<user><printer /><name /><fullname /><court /><ext /><section /></user>");
	XML.setElementTextContent( userDOM, "user/name" , userName );
	XML.setElementTextContent( userDOM, "user/printer", userPrinter );
	XML.setElementTextContent( userDOM, "user/fullname", userfullname );
	XML.setElementTextContent( userDOM, "user/court", userHomeCrtCode );
	XML.setElementTextContent( userDOM, "user/ext", userExt );
	XML.setElementTextContent( userDOM, "user/section", userSection );
	var xyz = S.getNode("/ds/EnterVariableData/user")
	if (null == xyz) {
		S.addNode( userDOM, "/ds/EnterVariableData");	
		if (doLog) do_Log("16 : added user in ds/entervariabledata"); }
	else {
		S.replaceNode("/ds/EnterVariableData/user", userDOM);	
		if (doLog) do_Log("16 : replaced user in ds/entervariabledata");  }
	xyz = S.getNode("/ds/EnterVariableData/user/roles")
	if (null == xyz) {
		S.addNode(userRoles, "/ds/EnterVariableData/user/roles");	
		if (doLog) do_Log("17"+userSection); }
	else {
		S.replaceNode("/ds/EnterVariableData/user", userRoles);	
		if (doLog) do_Log("17"+userSection); }
	S.addNode( minidom.selectSingleNode("/params/param/UserDetails") ,"/ds/EnterVariableData/UserDetails/");
	if (doLog) do_Log("18"+userSection);	
	WP.SetState(process, "ProgressBarUp", false); /** why ? **/ }

/**
 * WPOutput Step LoadOldData Class - ...
 * @constructor
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__LoadOldData() {
	CaseManWPProcessStep.apply(this,["LoadOldData"]); }

/**
 *
 */
CaseManWPProcessStep__LoadOldData.prototype = new CaseManWPProcessStep();

/**
 *
 */
CaseManWPProcessStep__LoadOldData.prototype.constructor = CaseManWPProcessStep__LoadOldData;

/**
 * 
 * @argument wpctrl
 * @argument wpprocess
 */
CaseManWPProcessStep__LoadOldData.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg = "CaseManWPProcessStep__LoadData.prototype.process ";
	var output = wpprocess.getOutput();
	if (null != output) {
		CaseManWPProcessStep.RaiseProgressBar();
		var params = new NonFormServiceParams();
		params.addSimpleParameter('outputId', '' + output.getServerId());
		var contextxml = wpprocess.getRequest().getContext();

		/** 
		 * If the editable output has been marked for bulk printing but there is a party on the case who has requested translation
		 * to Welsh, turn off bulk printing and alert the user will be printed locally.  Trac 4761
		 */
		if (output.getDoBulkPrint()) {
			var welshIndNode = contextxml.selectSingleNode("/WordProcessing/Case/WelshTranslation");
			var outputFinalNode = contextxml.selectSingleNode("/WordProcessing/Final");
			var jurisdictionNode = contextxml.selectSingleNode("/WordProcessing/Case/Jurisdiction");
			var outputFinalText = "Y";
			var welshIndText = "N";
			var jurisdictionText = "ALL";
			if ( null != outputFinalNode ) { outputFinalText = outputFinalNode.text; }
			if ( null != welshIndNode ) { welshIndText = welshIndNode.text; }
			if ( null != jurisdictionNode ) { jurisdictionText = jurisdictionNode.text; }
			
			if ( outputFinalText == "N" ) {
				if (welshIndText == "Y") {
					output.setDoBulkPrint(false);
					alert("A party associated with this case has requested a Welsh language translation of outputs created.\n"
					+ "As such, the output has not been automatically sent for Bulk Printing and will be printed locally.");
				}
				else if (jurisdictionText == "F") {
					output.setDoBulkPrint(false);
					alert("This case is a family enforcement case.\n"
						+ "As such, the output has not been automatically sent for Bulk Printing and will be printed locally.");
				}
		} }
		WPS.callService("getData", params, this, false, false); }	
	return this.getConditionFunction(wpprocess); }

/** 
 *
 */
CaseManWPProcessStep__LoadOldData.prototype.getConditionFunction = function(wpprocess) {
	var dataLoaded = wpprocess.getOutputStateId(WPState.tx_DOM_Reloaded);
	var progressBarUp = wpprocess.getOutputStateId(WPState.ProgressBarUp);
	return new Function("return WP.CheckState('"+dataLoaded+"', true) && WP.CheckState('"+progressBarUp+"', true);"); }

/**
 * WPOutput.__LoadData web service success handler
 */
CaseManWPProcessStep__LoadOldData.prototype.onSuccess = function(dom, serviceName) {
	var msg = "CaseManWPProcessStep__LoadOldData.prototype.onSuccess ";
	var process = this.getProcess();
	if (doLog) do_Log(msg + " for " + process ); /** CAN BE VERY INEFFICIENT: + " : " + dom.xml**/
	WP.SetState(process, WPState.tx_DOM, dom);
	WP.SetState(process, WPState.tx_DOM_Reloaded, true); }

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
 * Loading the QA Screen, if not done in a previous creation cycle of this output. 
 */
CaseManWPProcessStep__LoadQA.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var output = wpprocess.getOutput();
	var doQA = output.getDoQA();
	if ("true" == doQA) {
		var dsDom = WP.GetState(wpprocess, 'dsDOM');
		var vdNode = dsDom.selectSingleNode("//param/getdata/variabledata");		
		var notFirstRunOfQA = null != vdNode; 
		if (notFirstRunOfQA) {
		
			var sourceNode = vdNode.selectSingleNode("sourcedata");
			if (null != sourceNode) {
			 /** have TX already **/
			 	txdom = XML.createDOM();
			 	txdom.loadXML("<params><param name='xml'/></params>");
			 	txdom.selectSingleNode("/params/param").appendChild(vdNode.cloneNode(true));
			 	WP.SetState(wpprocess, WPState.tx_DOM, txdom);   
				WP.SetState(wpprocess, WPState.tx_DOM_Ready,true);  				
				wpprocess.lastStep = 4; 
				WP.SetState(wpprocess, 'QADone', true );
			 }
			 else
			 {
			 	/** grab qa answers and store them **/
			 	var evd = vdNode.selectSingleNode("EnterVariableData");
			 	var QADom = XML.createDOM();
			 	QADom.loadXML("<ds/>");
			 	if (null != evd) {
				 	QADom.selectSingleNode("/ds").appendChild(evd.cloneNode(true)); }
			 	WP.SetState(wpprocess, 'qaDOM', QADom);
			 	
			 	wpprocess.lastStep = 2; 
				WP.SetState(wpprocess, WPState.wpl_DOM_Ready, true);
				WP.SetState(wpprocess, 'QADone', true );
			 }
		}
		else {
			var QAFormName = "EnterVariableData_" + wpprocess.getOutput().getCJRReference();
			WPS.NavigateTo(QAFormName);
			wpctrl.setScreenProcess(wpprocess); } }
	else {
		/** if ccbc court case, decide wether or not to conitue with output production  **/
		if (true != output.getDoCCBC()) {
			WPError.FinishProcess(wpprocess); } }
	return this.getConditionFunction(wpprocess); }

/** 
 * Allows to proceed to next process step when the loaded qa screen has been saved, or
 * when no qa loaded, immediately.
 */
CaseManWPProcessStep__LoadQA.prototype.getConditionFunction = function(wpprocess) {
	var output = wpprocess.getOutput();
	var waitForQA = output.getDoQA();
	if ("true" == waitForQA) {
		var stateId = wpprocess.getOutputStateId('QADone');
		return new Function("return WP.CheckState('"+stateId+"', true);"); }
	else {
		return new Function("return true"); } }
		
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
			if (doLog) do_Log(msg+"calling service getNoticeOfIssueData");
			WPS.callService("getNoticeOfIssueData", params, this, false); }	}			
	return this.getConditionFunction(wpprocess); }

/** 
 *
 * @type Function
 * @returns the condition function - must return true upon evaluation untill the process continues
 */
CaseManWPProcessStep__ReLoadData.prototype.getConditionFunction = function(wpprocess) {
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
	if (doLog) do_Log(msg + " for " + process + " xml: " + dom.xml );
	WP.SetState(process, WPState.ds_DOM, dom);			
	CaseManWPProcessStep__LoadData.TransferUserDetails(process);
	WP.SetState(process, WPState.ds_DOM_Reload_Ready, true); }

/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to transform all data sourced from the app
 * into the wp variables xphats structure.
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__TransformData() {
	CaseManWPProcessStep.apply(this,["TransformData"]); }

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
	CaseManWPProcessStep.RaiseProgressBar();	
	var msg = "CaseManWPProcessStep__TransformData.prototype.process " + wpprocess;
	var output = wpprocess.getOutput();		
	var params = new NonFormServiceParams();
	params.addSimpleParameter('output', '' + output.getCJRReference());
	params.addSimpleParameter('outputUniqueID', '' + output.getUniqueId());
	var xml = WP.GetState(wpprocess, 'dsDOM');
	if (null != xml) {		
		if (output.getCJRReference() == 'CJR040a' || output.getCJRReference() == 'CJR041a' || output.getCJRReference() == 'CJR042a' ) {
			/** In this scenario the judgment id will be specified in the context xml so read
			   it from here and set it in the ds dom so that the judgment data that has been read
			   from the database will be contained in the resulting dom after the transformation **/
			var contextXml = wpprocess.getRequest().getContext();
			var judgmentId = contextXml.selectSingleNode("/WordProcessing/Event/JudgmentId").text;

			var JudgmentIdElement = xml.selectSingleNode("/params/param[@name='xml']/JudgementId");
			/** Store the judgment id in the ds dom <JudgementId> (note the extra 'e' in the spelling) **/
			JudgmentIdElement.text = judgmentId; }
		var ds = xml.selectSingleNode("/params/param[@name='xml']/ds");
		var id = xml.selectSingleNode("/params/param[@name='xml']/JudgementId");
		var du = xml.selectSingleNode("/params/param[@name='xml']/DuplicateEvent");
		var ce = xml.selectSingleNode("/params/param[@name='xml']/COEventSeq");
		var sn = xml.selectSingleNode("/params/param[@name='xml']/DebtSequence");
		var ev = xml.selectSingleNode("/params/param[@name='xml']/eventxml/CaseEvent");
		var jd = xml.selectSingleNode("/params/param[@name='xml']/judgementxml/ds/MaintainJudgment");
		var ob = xml.selectSingleNode("/params/param[@name='xml']/obligationxml/ds/MaintainObligations");
		var war = xml.selectSingleNode("/params/param[@name='xml']/ds/Warrant");
		var coes = xml.selectSingleNode("/params/param[@name='xml']/COES");
		var xfer = xml.selectSingleNode("/params/param[@name='xml']/transferxml/TransferCase");	
		var ae = xml.selectSingleNode("/params/param[@name='xml']/AENumber");
		//var ae2 = xml.selectSingleNode("/params/param[@name='xml']/AE/AEEvent/AEEventSeq");
		var ae2 = xml.selectSingleNode("/params/param[@name='xml']/AE");
		var userDetails = xml.selectSingleNode("/params/param[@name='xml']/UserDetails");					
		var previousSave = xml.selectSingleNode("/params/param[@name='xml']/getdata[variabledata]");		
		if (null != id) ds.appendChild(id);
		if (null != du) ds.appendChild(du);		
		if (null != sn) ds.appendChild(sn);
		if (null != ce) ds.appendChild(ce);	
		if (null != ev) ds.appendChild(ev);
		if (null!= jd || null!= ob)  { var wpElement =	xml.createElement("wp"); }
		if (null!= jd) wpElement.appendChild(jd);
		if (null!= ob) wpElement.appendChild(ob);
		if (null !=war) ds.appendChild(war);
		if (null!= jd || null!= ob) ds.appendChild(wpElement);
		if (null != coes) ds.appendChild(coes);
		if (null != xfer) ds.appendChild(xfer);	
		if( null != ae ) ds.appendChild(ae);
		if( null != ae2 ) ds.appendChild(ae2);	
		if( null != userDetails ) ds.appendChild(userDetails);
		if (null != previousSave) ds.appendChild(previousSave);
	
		/** The following code is needed by warrant returns NE (N54-Notice of eviction) and AI (EX96-Appointment fixed for possession) 
		    This code is to copy the warrant id and warrant returns id that is passed to wp from the client screen and 
		    store it in the main wp ds dom for later use by the DataProcessorTransform class
		   Get the context xml out of the process **/
		var contextXml = wpprocess.getRequest().getContext();
		var warrantIdNode = contextXml.selectSingleNode("/WordProcessing/Case/WarrantId");
		var warrantReturnsIdNode = contextXml.selectSingleNode("/WordProcessing/Event/WarrantReturnsId");
		if (null != warrantIdNode && null != warrantReturnsIdNode) {
			var warrantElement = xml.createElement("Warrant");
			warrantElement.appendChild(warrantIdNode.cloneNode(true));	
			warrantElement.appendChild(warrantReturnsIdNode.cloneNode(true));					
			/**TD 5229**/
			var selectedPartyAgainst_node = contextXml.selectSingleNode("/WordProcessing/Case/PartyAgainstNumber");
			warrantElement.appendChild(selectedPartyAgainst_node.cloneNode(true));
			/** TD 5229			
			   Anoop : Put CaseNumber Node in Warrant **/
			var warrantCaseNumberNode = xml.selectSingleNode("/params/param[@name='xml']/ds/Warrant/CaseNumber");
			warrantElement.appendChild(warrantCaseNumberNode.cloneNode(true));
			/** Anoop : Put CaseNumber Node in Warrant **/
			ds.appendChild(warrantElement);	}			
		params.addNodeParameter('xml', ds);
		var caseNumberNode = dom.selectSingleNode(CaseManWPXPath.dsDOM_ManageCase + '/' + CaseManWPXPath.dsDOM_CaseNumber);
		if (null != caseNumberNode) params.addSimpleParameter('caseNumber', WPS.getNodeTextContent(caseNumberNode));
		var coNumberNode = dom.selectSingleNode(CaseManWPXPath.dsDOM_MaintainCO + '/' + CaseManWPXPath.dsDOM_CONumber);
		if (null != caseNumberNode) params.addSimpleParameter('coNumber', WPS.getNodeTextContent(caseNumberNode)); }				
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
	return this.getConditionFunction(wpprocess); }

/** 
 *
 * @type Function
 * @returns the condition function - must return true upon evaluation untill the process continues
 */
CaseManWPProcessStep__TransformData.prototype.getConditionFunction = function(wpprocess) {
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
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to store all output data sourced.
 *
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__StoreData() {
	CaseManWPProcessStep.apply(this,["StoreData"]); }

/**
 *
 */
CaseManWPProcessStep__StoreData.prototype = new CaseManWPProcessStep();

/**
 *
 */
CaseManWPProcessStep__StoreData.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	CaseManWPProcessStep.RaiseProgressBar();
	var msg 		= "CaseManWPProcessStep__StoreData.prototype.process ";
	var output 		= wpprocess.getOutput();
	var request 	= wpprocess.getRequest();
	var context 	= request.getContext();
	var txDOM 		= WP.GetState(wpprocess,"txDOM");
	var txXML		= txDOM.selectSingleNode("/params/param[@name='xml']/*").xml;	
	var storeDOM 	= WPS.createDOM(null,null,null);
	storeDOM.loadXML(txXML);
	var vd = storeDOM.selectSingleNode("/variabledata");
	/** storing the output instance print options for reprinting **/
	var printOptionsDOM = WPS.createDOM(null, null, null);
	printOptionsDOM.loadXML("<printOptions><duplex/><tray/><copies/></printOptions>");
	var dupNod = printOptionsDOM.selectSingleNode("/printOptions/duplex");	
	var dupNodTxt = WPS.createTextNode(dupNod, output.getDuplexSetting());
	dupNod.appendChild(dupNodTxt);
	var traNod = printOptionsDOM.selectSingleNode("/printOptions/tray");	
	var traNodTxt = WPS.createTextNode(traNod, output.getTraySetting());
	traNod.appendChild(traNodTxt);
	var copNod = printOptionsDOM.selectSingleNode("/printOptions/copies");	
	var copNodTxt = WPS.createTextNode(dupNod, output.getCopiesSetting());
	copNod.appendChild(copNodTxt);
	vd.appendChild(printOptionsDOM.documentElement);	
	/** so far the storing of the print options **/	
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
	if (doLog) do_Log(msg + " for " + process); /** CAN BE VERY INEFFICIENT: + " : " + dom.xml**/
	WP.SetState(process, WPState.st_DOM, dom);
	WP.SetState(process, WPState.st_DOM_Ready, true); }

/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to load the xhtml
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__LoadXHTML4Editor() {
	CaseManWPProcessStep.apply(this,["LoadXHTML4Editor"]); }

/**
 *
 */
CaseManWPProcessStep__LoadXHTML4Editor.prototype = new CaseManWPProcessStep();

/**
 *
 */
CaseManWPProcessStep__LoadXHTML4Editor.prototype.constructor = CaseManWPProcessStep__LoadXHTML4Editor;

/**
 * SUPS CaseMan XHTML Loading process step
 * Initiates the loading of the xhtml, using the transformation dom as input.
 */
CaseManWPProcessStep__LoadXHTML4Editor.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg = "CaseManWPProcessStep__LoadXHTML4Editor.prototype.process ";
	if (doLog) do_Log(msg+"starts");
	if (wpprocess.mayEditOutputNow()) {
		var output = wpprocess.getOutput();		
		var params = new NonFormServiceParams();	
		var reportRequestDOM = WPS.createDOM();
		reportRequestDOM.loadXML(WPFR._FXSL_CreateRequestXHTML(wpprocess));
		params.addDOMParameter('ReportRequest', reportRequestDOM);
		WPS.setTransientStatusBarMessage("Word Processing editable output generation requested, please wait...");
		CaseManWPProcessStep.RaiseProgressBar();
		WPS.callService("createOutput", params, this, false); }
	if (doLog) do_Log(msg+"ends");
	return this.getConditionFunction(wpprocess); }

/** 
 *
 */
CaseManWPProcessStep__LoadXHTML4Editor.prototype.getConditionFunction = function(wpprocess) {
	var mayEditNow = wpprocess.mayEditOutputNow();
	if (mayEditNow) {
		var stateId = wpprocess.getOutputStateId(WPState.wpl_DOM_Ready);
		return new Function("return WP.CheckState('"+stateId+"', true);"); }
	else {
		return new Function("return true"); } }
	
/**
 * CaseManWPProcessStep__LoadXHTML4Editor web service success handler
 */
CaseManWPProcessStep__LoadXHTML4Editor.prototype.onSuccess = function(dom, serviceName) {
	var msg = "CaseManWPProcessStep__LoadXHTML4Editor.prototype.onSuccess ";
 	var process = this.getProcess();
	if (doLog) do_Log(msg+" "+process+" starts");		
	WP.SetState(process, WPState.wpl_DOM, dom);   
	WPS.addNode(dom.selectSingleNode("/ReportReference"), "/ds")
	WP.SetState(process, WPState.wpl_DOM_Ready, true);
	WP.GetInstance("CaseManWPCtrl").setScreenProcess(process);
	if (doLog) do_Log(msg+" "+process+" ENDS"); }

/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to load the xhtml
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__LoadXHTML4EditorPreviouslyCreated() {
	CaseManWPProcessStep.apply(this,["LoadXHTML4EditorPreviouslyCreatedEditorPreviouslyCreated"]); }

/**
 *
 */
CaseManWPProcessStep__LoadXHTML4EditorPreviouslyCreated.prototype = new CaseManWPProcessStep();

/**
 *
 */
CaseManWPProcessStep__LoadXHTML4EditorPreviouslyCreated.prototype.constructor = CaseManWPProcessStep__LoadXHTML4EditorPreviouslyCreated;

/**
 * SUPS CaseMan XHTML Loading process step
 * Initiates the loading of the xhtml, using the transformation dom as input.
 */
CaseManWPProcessStep__LoadXHTML4EditorPreviouslyCreated.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg = "CaseManWPProcessStep__LoadXHTML4EditorPreviouslyCreated.prototype.process ";
	if (doLog) do_Log(msg+"starts");
	if (wpprocess.mayEditOutputNow()) {
		var output = wpprocess.getOutput();		
		var params = new NonFormServiceParams();
		var request = wpprocess.getRequest();
		var context = request.getContext();		
		var reportIdNode = context.selectSingleNode("/WordProcessing/DocumentId");
		if (null != reportIdNode) {
			var reportId = WPS.getNodeTextContent(reportIdNode);
			params.addSimpleParameter('document-id', reportId);
			WPS.setTransientStatusBarMessage("Word Processing editable output generation requested, please wait...");
			/**CaseManWPProcessStep.RaiseProgressBar(); **/
			WPS.callService("getXhtml", params, this, false); } 
		else {
	 		/**alert("Could not locate the ID of the content to edit");**/
	 	}
	}		
	if (doLog) do_Log(msg+"ends");
	return this.getConditionFunction(wpprocess); }

/** 
 *
 */
CaseManWPProcessStep__LoadXHTML4EditorPreviouslyCreated.prototype.getConditionFunction = function(wpprocess) {
	var mayEditNow = wpprocess.mayEditOutputNow();
	if (mayEditNow) {
		var stateId = wpprocess.getOutputStateId(WPState.wpl_DOM_Ready);
		return new Function("return WP.CheckState('"+stateId+"', true);"); }
	else {
		return new Function("return true"); } }
	
/**
 * CaseManWPProcessStep__LoadXHTML4EditorPreviouslyCreated web service success handler
 */
CaseManWPProcessStep__LoadXHTML4EditorPreviouslyCreated.prototype.onSuccess = function(dom, serviceName) {
	var msg = "CaseManWPProcessStep__LoadXHTML4Editor.prototype.onSuccess ";
 	var process = this.getProcess();
	if (doLog) do_Log(msg+" "+process+" starts");		
	WP.SetState(process, WPState.wpl_DOM, dom);   
	WPS.addNode(dom.selectSingleNode("/ReportReference"), "/ds")
	WP.SetState(process, WPState.wpl_DOM_Ready, true);
	WP.GetInstance("CaseManWPCtrl").setScreenProcess(process);
	if (doLog) do_Log(msg+" "+process+" ENDS"); }

/**
 *
 */
function CaseManWPProcessStep__PollXHTML() { 
	CaseManWPProcessStep.apply(this,["PollXHTML"]);}
				
/**
 * CaseManWPProcessStep__PollXHTML super class is CaseManWPProcessStep
 */
CaseManWPProcessStep__PollXHTML.prototype = new CaseManWPProcessStep();

/**
 * CaseManWPProcessStep__PollXHTML constructor is CaseManWPProcessStep__PollXHTML
 */
CaseManWPProcessStep__PollXHTML.prototype.constructor = CaseManWPProcessStep__PollXHTML;

/** 
 * CaseManWPProcessStep__PollXHTML
 * @type Function
 * @returns the condition function - must return true upon evaluation untill the process continues
 */
CaseManWPProcessStep__PollXHTML.prototype.process = function(wpctrl, wpprocess) {
	var msg = "CaseManWPProcessStep__PollXHTML.prototype.process ";
	this.preprocess(wpctrl, wpprocess);
	var output = wpprocess.getOutput();
	if (wpprocess.mayEditOutputNow()) {
		WP.SetState(wpprocess, WPState.FW_PollReport_Ready, false);
		WP.SetState(wpprocess, WPState.FW_PollXHTML_Ready, false); 
		WP.SetState(wpprocess, WPState.FW_PollReport_Cancelled, false);
		WP.SetState(wpprocess, WPState.FW_PollXHTML_Cancelled, false); 
		WP.SetState(wpprocess, WPState.FW_PollReport_FirstTime, null); 
		WP.SetState(wpprocess, WPState.FW_PollXHTML_FirstTime, null); 
		WP.SetState(wpprocess, WPState.FW_PollReport_LastTime, null); 
		WP.SetState(wpprocess, WPState.FW_PollXHTML_LastTime, null);
		CaseManWPProcessStep__PollXHTML.POLL(this);
		WPS.setTransientStatusBarMessage("Word Processing editable output generation requested, please wait..."); }
	return this.getConditionFunction(wpprocess); }

/**
 * CaseManWPProcessStep__PollXHTML Interval the number of milliseconds between checks whether the xhtml is ready
 * @type Integer
 */
CaseManWPProcessStep__PollXHTML.Interval = 1000;

/**
 *
 */
CaseManWPProcessStep__PollXHTML.__POLL = function(instance) {
	var msg = "CaseManWPProcessStep__PollXHTML.__POLL ";
	if (doLog) do_Log(msg+"Starts");
	var process = instance.getProcess();
	var stopPoll =WP.GetState(process, WPState.FW_PollXHTML_Ready);
	if (true != stopPoll) {
		var resultNode = WPS.getNode("/ds/ReportReference");
		if (doLog) do_Log(msg + resultNode.xml);
		var params = new NonFormServiceParams();
		params.addNodeParameter("ReportReference", resultNode);
		var pro = CaseManWPXPath.ProgressBar;
		if (null != pro) {
			var stateId = process.getOutputStateId(WPState.FW_PollXHTML_Ready);
			var polStateReady = WP.CheckState(stateId, true);
			if (true != polStateReady) {
				CaseManWPProcessStep.MakeProgressBarProgress(); } }
		else {
			if (true != CaseManWPProcessStep__PollXHTML.WARNEDOFNONINTEGRATION) {
				CaseManWPProcessStep__PollXHTML.WARNEDOFNONINTEGRATION = true; } }
				WPS.callService("getReport", params, instance, null, false); }
	else {
		if (doLog) do_Log(msg+" did not execute a late poll callback."); }
	WP.SetState(process, WPState.FW_PollXHTML_LastTime, new Date());
	if (doLog) do_Log(msg+"Ends"); }

/**
 *
 */
CaseManWPProcessStep__PollXHTML.POLL = function(instance) {
	var msg = "CaseManWPProcessStep__PollXHTML.POLL ";
	if (doLog) do_Log(msg+"Starts");
	var process = instance.getProcess();
	var state = WP.GetState(process, WPState.FW_PollXHTML_LastTime);
	if (null == state) {
		WP.SetState(process, WPState.FW_PollXHTML_FirstTime, new Date());
		CaseManWPProcessStep__PollXHTML.__POLL(instance);
		instance.XHTMLTimeOuts=0; }
	else {
		var now = new Date();
		var diff = now - state;
		if (diff > CaseManWPProcessStep__PollXHTML.Interval) {
			var start = WP.GetState(process, WPState.FW_PollXHTML_FirstTime);
			var latest = now - start;
			if (latest < WPFR.TIMEOUT) { 
				CaseManWPProcessStep__PollXHTML.__POLL(instance); }
			else {
				var keepWaitingTxt = "The generation of the word processing output took ";

				if (0 == instance.XHTMLTimeOuts) {
					keepWaitingTxt += WPFR.TIMEOUT_PHRASE +" so far...\n"; }			
				else {
					keepWaitingTxt += (instance.XHTMLTimeOuts+1) + " times " + WPFR.TIMEOUT_PHRASE +" so far...\n"; }
				keepWaitingTxt += "Click OK to keep waiting for its completion,";
				keepWaitingTxt += "or Cancel to abandon waiting (output will still be produced)";
				if (confirm(keepWaitingTxt)) {
					WP.SetState(process, WPState.FW_PollXHTML_FirstTime, new Date());
					instance.XHTMLTimeOuts++;
					 }
				else {
					WPError.FinishProcessOfStep(instance); } } }
		else {
			if (doLog) do_Log(msg+" no polling happened as it was too soon (less than "+CaseManWPProcessStep__PollXHTML.Interval+" ms)"); } }
	if (doLog) do_Log(msg+"Ends"); }

/** 
 * CaseManWPProcessStep__CreateReport
 * @type Function
 * @returns the condition function - must return true upon evaluation untill the process continues
 */
CaseManWPProcessStep__PollXHTML.prototype.getConditionFunction = function(wpprocess)  {
	if (wpprocess.mayEditOutputNow()) {
		var stateId = wpprocess.getOutputStateId(WPState.FW_PollXHTML_Ready);
		top.__xxx = this;
		return new Function("CaseManWPProcessStep__PollXHTML.POLL(top.__xxx); return WP.CheckState('"+stateId+"', true);"); }
	else {
		return new Function("return true");	} }

/**
 *
 */
CaseManWPProcessStep__PollXHTML.prototype.onSuccess = function(dom) {
	var msg = "CaseManWPProcessStep__PollXHTML.prototype.onSuccess ";
	if (doLog) do_Log(msg+"Starts");
	/**if (doLog) do_Log(msg+dom.xml);  CAN BE VERY INEFFICIENT dom.xml **/
	var statusNode	 	= dom.selectSingleNode("/ReportResponse/Status");
	var printStatusNode	= dom.selectSingleNode("/ReportResponse/PrintStatus");
	var status			= XML.getNodeTextContent(statusNode);
	var printStatus		= XML.getNodeTextContent(printStatusNode);
	WPS.setTransientStatusBarMessage(WPFR.DecodeReportGenerationStatus(status));
	if(status == CaseManWPProcessStep__PollXHTML.Status_Cancelled) {
		WPError.FinishProcessOfStep(this);
		this.stopPolling(); }
	else if(status == CaseManWPProcessStep__PollXHTML.Status_Error) {
		var errorDescNode	= dom.selectSingleNode("/ReportResponse/Error");
		var errorDesc		= XML.getNodeTextContent(errorDescNode);
		WPS.setTransientStatusBarMessage(errorDesc);
		alert("There was an exception producing the output: \n" + errorDesc);	
		this.stopPolling();
		WPError.FinishProcessOfStep(this); }	
	else if (status == CaseManWPProcessStep__PollXHTML.Status_OkToShowPDF) {
		var documentIdNode	= dom.selectSingleNode("/ReportResponse/DocumentId");
		var documentId		= XML.getNodeTextContent(documentIdNode);
		WP.SetState(this.getProcess(), WPState.DocumentId, documentId);
		WP.SetState(this.getProcess(), WPState.XhtmlDocumentId, documentId);		
		this.stopPolling();	}
	else {	
		CaseManWPProcessStep__PollXHTML.POLL(this); }
	if (doLog) do_Log(msg+"ENDS"); }
	
CaseManWPProcessStep__PollXHTML.prototype.stopPolling = function() {
	var process = this.getProcess();
	WP.SetState(process, WPState.FW_PollXHTML_Ready, true);	}
								
/**
 *
 */
CaseManWPProcessStep__PollXHTML.Status_Cancelled = '5';

/**
 *
 */
CaseManWPProcessStep__PollXHTML.Status_Error = '4';

/**
 *
 */
CaseManWPProcessStep__PollXHTML.Status_DocumentSaved = '3';
 
/**
 *
 */
CaseManWPProcessStep__PollXHTML.Status_OkToShowPDF = '2';

/**
 *
 */
CaseManWPProcessStep__PollXHTML.GetStatusBarMessage = function(status) {
	switch(status)  {
		case "0": return "Report has been queued"; 			break;
		case "1": return "Report is being generated";		break;
		case "2": return "Report is being saved";			break;
		case "3": return "Report generation has completed";	break;
		case "4": return "Error in producing Report";		break;
		case "5": return " ";								break; } }
		
/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to load the xhtml generated for the editor
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__LoadCreatedXHTML() {
	CaseManWPProcessStep.apply(this,["LoadCreatedXHTML"]); }

/**
 *
 */
CaseManWPProcessStep__LoadCreatedXHTML.prototype = new CaseManWPProcessStep();

/**
 *
 */
CaseManWPProcessStep__LoadCreatedXHTML.prototype.constructor = CaseManWPProcessStep__LoadCreatedXHTML;

/**
 * SUPS CaseMan Editor Loading process step
 *
 * Redirects the application to the editor screen
 */
CaseManWPProcessStep__LoadCreatedXHTML.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg = "CaseManWPProcessStep__LoadCreatedXHTML.prototype.process ";
	if (doLog) do_Log(msg+"starts");
	if (wpprocess.mayEditOutputNow()) {
		/**var resultNode = WPS.getNode("/ds/ReportReference/Id");
		  var id = WPS.getNodeTextContent(resultNode);**/
		var id = WP.GetState(wpprocess, "documentId");
		if (doLog) do_Log(msg + ": getting xhtml for report id " + id);
		var params = new NonFormServiceParams();
		params.addSimpleParameter("document-id", id);	
		WPS.callService("getXhtml", params, this, null, false); }
	if (doLog) do_Log(msg+"ends");
	return this.getConditionFunction(wpprocess); }

/** 
 *
 */
CaseManWPProcessStep__LoadCreatedXHTML.prototype.getConditionFunction = function(wpprocess) {
	if (wpprocess.mayEditOutputNow()) {
		var stateId = wpprocess.getOutputStateId(WPState.LoadXHTMLDone);
		return new Function("return WP.CheckState('"+stateId+"', true);"); }
	else {
		return new Function("return true"); } }
	
/**
 * CaseManWPProcessStep__LoadCreatedXHTML web service success handler
 */
CaseManWPProcessStep__LoadCreatedXHTML.prototype.onSuccess = function(dom, serviceName) {
	var msg = "CaseManWPProcessStep__LoadCreatedXHTML.prototype.onSuccess ";
	var process = this.getProcess();
	if (doLog) do_Log(msg+" "+process+" starts");
	dom.setProperty("SelectionNamespaces", "xmlns:fo='http://www.w3.org/1999/XSL/Format'");
	var stupidBlock = dom.selectSingleNode("//fo:block[1]");
	while (null != stupidBlock){
		var goodDiv = dom.createElement("div");
		while (stupidBlock.hasChildNodes()) {
			var firstChild = stupidBlock.firstChild;
			goodDiv.appendChild(firstChild.cloneNode(true));
			stupidBlock.removeChild(firstChild); }
		var par = stupidBlock.parentNode;
		par.insertBefore(goodDiv, stupidBlock);
		par.removeChild(stupidBlock);
		stupidBlock = dom.selectSingleNode("//fo:block[1]"); }								
	
	this.fixDom(dom);
	WP.SetState(process, WPState.LoadXHTMLDone, true);
	WP.SetState(process, WPState.wpl_DOM, dom);
	/**if (doLog) do_Log(msg+" "+dom.xml); CAN BE VERY INEFFICIENT: + " : " + dom.xml**/
	if (doLog) do_Log(msg+" "+process+" ENDS"); }
		
/**
 * Helper function to clean the xhtml dom from any possible fo (introduced by variables)
 */
CaseManWPProcessStep__LoadCreatedXHTML.prototype.fixDom = function( dom ) {
	this.fixDomElement(dom, "fo:table-cell", "td");
	this.fixDomElement(dom, "fo:table-row", "tr"); }

/**
 * Helper function used by CaseManWPProcessStep__LoadCreatedXHTML.prototype.fixDom  (only)
 */
CaseManWPProcessStep__LoadCreatedXHTML.prototype.fixDomElement = function( dom, findElem, replaceElem ) {
	var cellarr = dom.selectNodes("//"+findElem);
	for( var i = 0; i < cellarr.length; i++) {
	  	var cell = cellarr[i];
		var parent = cell.parentNode;
		var childarr = cell.childNodes;
		var rtc = dom.createElement(replaceElem);
		for(var j =0; j < childarr.length; j++) {	
			rtc.appendChild( childarr[j].cloneNode(true)); }
		for(var j =0; j < childarr.length; j++) {	
			cell.removeChild( childarr[j]); }
		var attr = cell.attributes;
		for (var j=0; j < attr.length; j++) {
			var oldStyle = rtc.getAttribute("style");
			if (null == oldStyle) {
				oldStyle= ""; }
			else {
				oldStyle = oldStyle + " "; }
			var newStyleValue = oldStyle + attr.item(j).name + ": " + attr.item(j).value+";"
			rtc.setAttribute("style", newStyleValue); }	
		parent.appendChild(rtc);
		parent.removeChild(cell); } }

/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to load the editor for the output
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__LoadEditor() {
	CaseManWPProcessStep.apply(this,["LoadEditor"]); }

/**
 *
 */
CaseManWPProcessStep__LoadEditor.prototype = new CaseManWPProcessStep();

/**
 *
 */
CaseManWPProcessStep__LoadEditor.prototype.constructor = CaseManWPProcessStep__LoadEditor;

/**
 * SUPS CaseMan Editor Loading process step
 *
 * Redirects the application to the editor screen
 */
CaseManWPProcessStep__LoadEditor.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg = "CaseManWPProcessStep__LoadEditor.prototype.process ";
	if (doLog) do_Log(msg+"starts");
	if (wpprocess.mayEditOutputNow()) {
		var cancelledXHTML = WP.GetState(wpprocess, WPState.FW_PollXHTML_Cancelled);
		if (true == cancelledXHTML) {
			wpprocess.lastStep = wpprocess.steps.length - 1; }
		else {
			WPS.NavigateTo("WPEditor");
			WP.SetState(wpprocess, WPState.ProgressBarUp, false); } }
	if (doLog) do_Log(msg+"ends");
	return this.getConditionFunction(wpprocess); }

/** 
 *
 */
CaseManWPProcessStep__LoadEditor.prototype.getConditionFunction = function(wpprocess) {
	if (wpprocess.mayEditOutputNow()) {
		var stateId = wpprocess.getOutputStateId(WPState.EditingDone);
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
	if (doLog) do_Log(msg+" "+process+" ENDS"); }

/**
 *
 */
CaseManWPProcessStep__LoadEditor.reloadEditor = function(process, editor) {
	WP.SetXhtmlInEditor(process, editor); }

/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to save the editor for the output
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__SaveEditor() {
	CaseManWPProcessStep.apply(this,["SaveEditor"]); }

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
		CaseManWPProcessStep.RaiseProgressBar();
		var output = wpprocess.getOutput();
		var request 	= wpprocess.getRequest();
		var context 	= request.getContext();
		var wpDOM 		= WP.GetState(wpprocess, WPState.wps_DOM);
		var txDOM 		= WP.GetState(wpprocess, WPState.tx_DOM);
		if (null != txDOM) 
		{
			var finalFlag	= WP.GetState(wpprocess, WPState.wps_FIN);
			var vdNode 		= txDOM.selectSingleNode("/params/param[@name='xml']/variabledata");
			if (null != vdNode) 
			{
				var vdXHTML   = txDOM.selectSingleNode("/params/param[@name='xml']/variabledata/xhtml");		
				var finalNode = txDOM.createElement("outputIsFinal");
				finalNode.appendChild(txDOM.createTextNode(""+finalFlag));			
				vdNode.appendChild(finalNode);		
				if (null != wpDOM && null != wpDOM.documentElement) 
				{
					vdXHTML.appendChild(wpDOM.documentElement.cloneNode(true)); 
				} 
			}
			else 
			{
				vdNode = txDOM.selectSingleNode("/getdata/variabledata");
				if (null != vdNode) 
				{
					var vdXHTML   = txDOM.selectSingleNode("/getdata/variabledata/xhtml");		
					var finalNode = txDOM.createElement("outputIsFinal");
					finalNode.appendChild(txDOM.createTextNode(""+finalFlag));			
					vdNode.appendChild(finalNode);		
					if (null != wpDOM && null != wpDOM.documentElement) 
					{
						vdXHTML.appendChild(wpDOM.documentElement.cloneNode(true)); 
					}
				} 
			}
		}
		var wpDOM 		= WP.GetState(wpprocess, WPState.wps_DOM);
		var params = new NonFormServiceParams();
		params.addDOMParameter('xml-document', wpDOM);
		WPS.setTransientStatusBarMessage("Word Processing output saving xhtml, please wait...");
		CaseManWPProcessStep.RaiseProgressBar();	
		WPS.callService("setXhtml", params, this, false); 
	}
	return this.getConditionFunction(wpprocess); 
}

/** 
 *
 */
CaseManWPProcessStep__SaveEditor.prototype.getConditionFunction = function(wpprocess) {
	if (wpprocess.mayEditOutputNow()) {
		var stateId = wpprocess.getOutputStateId(WPState.wps_DOM_Ready);
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
	var docId = null;
	var node = dom.selectSingleNode("/Document");
	if (null != node) {
		docId = WPS.getNodeTextContent(node); }
	WP.SetState(process, WPState.wps_DocId, docId);
	WP.SetState(process, WPState.wps_DOM_Ready, true); 
	if (doLog) do_Log(msg+" "+process+" ENDS"); }
				
/**
 * CaseManWPProcessStep__CreatePDF
 * Interacts with the SUPS Framework solution to create the PDF document.
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__CreateReport() {
	CaseManWPProcessStep.apply(this,["CreateReport"]); }
				
/**
 * CaseManWPProcessStep__CreateReport super class is CaseManWPProcessStep
 */
CaseManWPProcessStep__CreateReport.prototype = new CaseManWPProcessStep();

/**
 * CaseManWPProcessStep__CreateReport constructor is CaseManWPProcessStep__CreateReport
 */
CaseManWPProcessStep__CreateReport.prototype.constructor = CaseManWPProcessStep__CreateReport;

/**
 * CaseManWPProcessStep__CreateReport process class, as invoked by the 'mechanics of wp processing;
 */
CaseManWPProcessStep__CreateReport.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg = "CaseManWPProcessStep__CreateReport.prototype.process ";
	/**if (wpprocess.mustCreateReportNow()) { **/
		var output = wpprocess.getOutput();
		var params = new NonFormServiceParams();
		params.addSimpleParameter('reportType','WP');
		var reportRequestDOM = WPS.createDOM();	
		var printConfig = WPFR._GetPrintConfig(wpprocess);
		var xhtmlString = WPFR._FXSL_CreateRequestPDF(wpprocess, printConfig["type"], printConfig["server"], printConfig["printer"], printConfig["tray"], printConfig["numberOfCopies"], printConfig["duplex"] );
		reportRequestDOM.loadXML(xhtmlString);
		params.addDOMParameter('ReportRequest', reportRequestDOM);
		WPS.setTransientStatusBarMessage("Word Processing output generation requested, please wait...");
		WPS.callService("createOutput", params, this, false); 
	/**} **/
	return this.getConditionFunction(wpprocess); }
				
/** 
 * CaseManWPProcessStep__CreateReport
 * @type Function
 * @returns the condition function - must return true upon evaluation untill the process continues
 */
CaseManWPProcessStep__CreateReport.prototype.getConditionFunction = function(wpprocess)  {
	if (wpprocess.mustCreateReportNow()) {
		var stateId = wpprocess.getOutputStateId(WPState.FW_CreateReport_Ready);
		return new Function("return WP.CheckState('"+stateId+"', true);"); }
	else {
		return new Function("return true;"); } }
	
/**
 * CaseManWPProcessStep__CreateReport web service success handler
 */
CaseManWPProcessStep__CreateReport.prototype.onSuccess = function(dom, serviceName) {
	var msg = "CaseManWPProcessStep__CreateReport.prototype.onSuccess";
	var process = this.getProcess();
	if (doLog) do_Log(msg+" "+process+" starts");
	if (doLog) do_Log(msg+" "+process+" ... "); /** CAN BE VERY INEFFICIENT: + " : " + dom.xml**/
	/** Remove the ReportReference node from DOM before storing a new one. 
		 If this is not done then as more outputs are created, first ReportReference element would be used. **/
	WPS.removeNode("/ds/ReportReference");
	WPS.addNode(dom.selectSingleNode("/ReportReference"), "/ds");
	WP.SetState(process, WPState.FW_CreateReport_Ready, true);   
	WP.SetState(process, WPState.FW_CreateReport_DOM, dom);   
	if (doLog) do_Log(msg+" "+process+" ENDS"); }
								
/**
 *
 */
function CaseManWPProcessStep__PollReport() { 
	CaseManWPProcessStep.apply(this,["PollReport"]);}
				
/**
 * CaseManWPProcessStep__PollReport super class is CaseManWPProcessStep
 */
CaseManWPProcessStep__PollReport.prototype = new CaseManWPProcessStep();

/**
 * CaseManWPProcessStep__PollReport constructor is CaseManWPProcessStep__PollReport
 */
CaseManWPProcessStep__PollReport.prototype.constructor = CaseManWPProcessStep__PollReport;

/** 
 * CaseManWPProcessStep__PollReport
 * @type Function
 * @returns the condition function - must return true upon evaluation untill the process continues
 */
CaseManWPProcessStep__PollReport.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg = "CaseManWPProcessStep__PollPDF.prototype.process ";
	if (wpprocess.mustCreateReportNow()) {
		var output = wpprocess.getOutput();
		WP.SetState(wpprocess, WPState.FW_PollReport_Ready, false);
		WP.SetState(wpprocess, WPState.FW_PollXHTML_Ready, false); 
		WP.SetState(wpprocess, WPState.FW_PollReport_Cancelled, false);
		WP.SetState(wpprocess, WPState.FW_PollXHTML_Cancelled, false); 
		WP.SetState(wpprocess, WPState.FW_PollReport_FirstTime, null);
		WP.SetState(wpprocess, WPState.FW_PollXHTML_FirstTime, null);
		WP.SetState(wpprocess, WPState.FW_PollReport_LastTime, null);
		WP.SetState(wpprocess, WPState.FW_PollXHTML_LastTime, null);
		CaseManWPProcessStep__PollReport.POLL(this);
		WPS.setTransientStatusBarMessage("Word Processing output generation requested, please wait..."); }
	return this.getConditionFunction(wpprocess); }

/**
 *
 */
CaseManWPProcessStep__PollReport.Interval = 1000;

/**
 *
 */
CaseManWPProcessStep__PollReport.__POLL = function(instance) {
	var msg = "CaseManWPProcessStep__PollReport.__POLL ";
	if (doLog) do_Log(msg+"Starts");
	var process = instance.getProcess();
	var stopPoll =WP.GetState(process, WPState.FW_PollReport_Ready);
	if (true != stopPoll) {
		var resultNode = WPS.getNode("/ds/ReportReference");
		if (doLog) do_Log(msg);
		if (doLog) do_Log(msg);
		if (doLog) do_Log(msg + resultNode.xml);
		if (doLog) do_Log(msg);
		if (doLog) do_Log(msg);
		if (doLog) do_Log(msg);				
		var params = new NonFormServiceParams();
		params.addNodeParameter("ReportReference", resultNode);			
		var pro = CaseManWPXPath.ProgressBar; 
		if (null != pro) {
			var stateId = process.getOutputStateId(WPState.FW_PollReport_Ready);
			var polStateReady = WP.CheckState(stateId, true);
			if (true != polStateReady) {
				CaseManWPProcessStep.RaiseProgressBar();
				CaseManWPProcessStep.MakeProgressBarProgress(); } }
		else {
			if (true != CaseManWPProcessStep__PollReport.WARNEDOFNONINTEGRATION) {
				CaseManWPProcessStep__PollReport.WARNEDOFNONINTEGRATION = true; } }
				WPS.callService("getReport", params, instance, null, false); }
	else {
		if (doLog) do_Log(msg+" did not execute a late poll callback."); }
	WP.SetState(process, WPState.FW_PollReport_LastTime, new Date());
	if (doLog) do_Log(msg+"Ends"); }

/**
 *
 */
CaseManWPProcessStep__PollReport.POLL = function(instance) {
	var msg = "CaseManWPProcessStep__PollReport.POLL ";
	if (doLog) do_Log(msg+"Starts");
	var process = instance.getProcess();
	var state = WP.GetState(process, WPState.FW_PollReport_LastTime);
	if (null == state) {
		WP.SetState(process, WPState.FW_PollReport_FirstTime, new Date());
		CaseManWPProcessStep__PollReport.__POLL(instance); }
	else {
		var now = new Date();
		var diff = now - state;
		if (diff > CaseManWPProcessStep__PollReport.Interval) {
			var start = WP.GetState(process, WPState.FW_PollReport_FirstTime);
			var latest = now - start;
			if (latest < WPFR.TIMEOUT) { 
				CaseManWPProcessStep__PollReport.__POLL(instance); }
			else {
				if (confirm("The generation of the word processing output took " + WPFR.TIMEOUT_PHRASE +" so far.\n"+
							"Click OK to keep waiting for its completion, or Cancel to abandon waiting (output will still be produced)")) {
							WP.SetState(process, WPState.FW_PollReport_FirstTime, new Date()); }
				else {
					WPError.FinishProcessOfStep(instance); } } }
		else {
			if (doLog) do_Log(msg+" no polling happend as it was too soon (less than "+CaseManWPProcessStep__PollReport.Interval+" ms)"); } }	
	if (doLog) do_Log(msg+"Ends"); }

/** 
 * CaseManWPProcessStep__CreateReport
 * @type Function
 * @returns the condition function - must return true upon evaluation untill the process continues
 */
CaseManWPProcessStep__PollReport.prototype.getConditionFunction = function(wpprocess)  {
	if (wpprocess.mustCreateReportNow()) {
		var stateId = wpprocess.getOutputStateId(WPState.FW_PollReport_Ready);
		top.__xxx = this;
		return new Function("CaseManWPProcessStep__PollReport.POLL(top.__xxx); return WP.CheckState('"+stateId+"', true);"); }
	else {
		return new Function("return true;"); } }

/**
 *
 */
CaseManWPProcessStep__PollReport.prototype.onSuccess = function(dom) {
	var msg = "CaseManWPProcessStep__PollReport.prototype.onSuccess ";
	if (doLog) do_Log(msg+"Starts");
	// if (doLog) do_Log(msg+dom.xml); /** CAN BE VERY INEFFICIENT: + " : " + dom.xml**/
	var statusNode	 	= dom.selectSingleNode("/ReportResponse/Status");
	var printStatusNode	= dom.selectSingleNode("/ReportResponse/PrintStatus");
	var status			= XML.getNodeTextContent(statusNode);
	var printStatus		= XML.getNodeTextContent(printStatusNode);
	WPS.setTransientStatusBarMessage(WPFR.DecodeReportGenerationStatus(status) + " - " + WPFR.DecodeReportPrintStatus(printStatus));
	if (status == CaseManWPProcessStep__PollReport.Status_Cancelled) {
		WPError.FinishProcessOfStep(this);
		this.stopPolling(); }
	else if(status == CaseManWPProcessStep__PollReport.Status_Error) {
		var errorDescNode	= dom.selectSingleNode("/ReportResponse/Error");
		var errorDesc		= XML.getNodeTextContent(errorDescNode);
		WPS.setTransientStatusBarMessage(errorDesc);	
		alert("There was an exception producing the output: \n" + errorDesc);
		this.stopPolling();
		WPError.FinishProcessOfStep(this); }	
	else if (status == CaseManWPProcessStep__PollReport.Status_OkToShowPDF) {
		var documentIdNode	= dom.selectSingleNode("/ReportResponse/DocumentId");
		var documentId		= XML.getNodeTextContent(documentIdNode);
		var output = this.getProcess().getOutput();
		WP.SetState(this.getProcess(), WPState.DocumentId, documentId);
		var str = "WPFR.ShowDocument('CaseManOutput"+documentId+"', "+documentId+");";
		setTimeout(str, WPFR.TIMEOUT_PDFWIND);		
		WPS.setTransientStatusBarMessage("");
		var printedFlag = "";
 		if (printStatus == '2') printedFlag = "Y";
		if (printStatus == '4') printedFlag = "N";
		WP.SetState(this.getProcess(), WPState.wps_Printed, printedFlag);	
		this.stopPolling(); } 
	else {	
		CaseManWPProcessStep__PollReport.POLL(this); }
	if (doLog) do_Log(msg+"ENDS"); }

/**
 *
 */
CaseManWPProcessStep__PollReport.prototype.stopPolling = function() {
	var process = this.getProcess();
	WP.SetState(process, WPState.FW_PollReport_Ready, true);
	WPS.removeNode("/ds/ReportReference"); }
					
/**
 *
 */
CaseManWPProcessStep__PollReport.Status_Cancelled = '5';

/**
 *
 */
CaseManWPProcessStep__PollReport.Status_Error = '4';

/**
 *
 */
CaseManWPProcessStep__PollReport.Status_OkToShowPDF = '2';

/**
 *
 */
CaseManWPProcessStep__PollReport.GetStatusBarMessage = function(status) {
	switch(status) {
		case "0": return "Report has been queued"; 			break;
		case "1": return "Report is being generated";		break;
		case "2": return "Report is being saved";			break;
		case "3": return "Report generation has completed";	break;
		case "4": return "Error in producing Report";		break;
		case "5": return " ";								break; } }
			
/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to load the output as PDF
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__ViewPDF() {
	CaseManWPProcessStep.apply(this,["ViewPDF"]); }

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
	var docId = null;
	if (wpprocess.mayEditOutputNow()) {
		docId = WP.GetState(wpprocess, WPState.DocumentId); }
	else {
		docId = WP.GetContextValue(wpprocess.getRequest().getContext(), "/WordProcessing/DocumentId"); }
	var str = "WPFR.ShowDocument('CaseManOutput"+docId+"', "+docId+");";
	setTimeout(str, WPFR.TIMEOUT_PDFWIND);		
	return this.getConditionFunction(wpprocess); }
	
/** 
 *
 * @type Function
 * @returns the condition function - must return true upon evaluation untill the process continues
 */
CaseManWPProcessStep__ViewPDF.prototype.getConditionFunction = function(wpprocess) {
	return new Function("return true"); }
	
/**
 * CaseManWPProcessStep__ViewPDF web service success handler
 */
CaseManWPProcessStep__ViewPDF.prototype.onSuccess = function(dom, serviceName) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to print preview the output
 * in CaseMAN.
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__PrintPreview() {
	CaseManWPProcessStep.apply(this,["PrintPreview"]); }

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
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to print the output as per 'default'
 * in CaseMAN.
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__Print_DEFAULT() {
	CaseManWPProcessStep.apply(this,["Print_DEFAULT"]); }

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
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to clean up the output process
 * in CaseMAN.
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__CleanUp() {
	CaseManWPProcessStep.apply(this,["CleanUp"]); }

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
	CaseManWPProcessStep.LowerProgressBar(wpprocess);
	var output = wpprocess.getOutput();
	top.WPCtrl.ClearState(wpprocess);
	top.WPCtrl.CaseManWPDIDSOMETHING = true;
	top.WPCtrl.CaseManORADIDSOMETHING = false;
	if (doLog) do_Log(msg + " for output: " + output);
	var qLength = WPCtrl.ProcessQ.length;
	var isLastRequestOnQueue = qLength > 0 ? false : true;	
	var doRedirection = isLastRequestOnQueue &&  (true == wpprocess.getAlwaysCallback() || ( "true" == output.getDoQA() && "Open" != wpprocess.getName() && "Print" != wpprocess.getName()) || wpprocess.mayEditOutputNow(output));
	if (doLog) {
		do_Log(msg + "doRedirection: " + doRedirection);
		do_Log(msg + "wpprocess.getAlwaysCallback(): " + wpprocess.getAlwaysCallback());
		do_Log(msg + "output.getDoQA(): " + output.getDoQA());
		do_Log(msg + "output.getDoWP(): " + output.getDoWP()); }
	if (doRedirection) {
		var callBackToScreen = wpprocess.getCallback()
		if (doLog) do_Log(msg + "wpprocess.getCallback(): " + callBackToScreen);
		if (null != callBackToScreen) {
			WPS.NavigateTo(callBackToScreen); }	}		
	return this.getConditionFunction(wpprocess); }
	
/** 
 *
 */
CaseManWPProcessStep__CleanUp.prototype.getConditionFunction = function(wpprocess) {
	// the the attrib id of the process to provide a hook to the prcess here
	return new Function("return true"); }
					
	
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
	if (doLog) do_Log(msg + " for " + process); /** CAN BE VERY INEFFICIENT: + " : " + dom.xml**/
  	var eventSeqNode = dom.selectSingleNode("/Outputs/Output[1]/EventSeq");
    if (null != eventSeqNode) {
    	var eventSeq =  XML.getNodeTextContent(eventSeqNode); 
    	var editOrPDF = "N" == WPS.getNodeTextContent(dom.selectSingleNode("/Outputs/Output[1]/FinalInd")) ? "edit" : "pdf";
		var outputId = WPS.getNodeTextContent(dom.selectSingleNode("/Outputs/Output[1]/OutputId"));
		WP.SetState(process, WPState.ooo_EdirOrView, editOrPDF);   
		WP.SetState(process, WPState.ooo_OutputId, outputId);  
		WP.SetState(process, WPState.ooo_Ready,'true'); }
	else {
		throw new Error(msg=" eventSeqCode is null : <textarea>" +dom2.xml+"</textarea>"); } 
	if (doLog) do_Log(msg+"ends"); }
	
/**
 * WPOutput Nested Class - Interface with Server side data loading
 * @constructor
 * @returns void
 * @throws
 */
function CaseManWPProcessStep__SetDocument() {
	CaseManWPProcessStep.apply(this,["SetDocument"]); }

/**
 *
 */
CaseManWPProcessStep__SetDocument.prototype = new CaseManWPProcessStep();

/**
 *
 */
CaseManWPProcessStep__SetDocument.prototype.constructor = CaseManWPProcessStep__SetDocument;


CaseManWPProcessStep__SetDocument.prototype.process = function(wpctrl, wpprocess) {
	this.preprocess(wpctrl, wpprocess);
	var msg = "CaseManWPProcessStep__SetDocument.prototype.process ";
	if (wpprocess.mustCreateReportNow()) {		
		var output = wpprocess.getOutput();
		var outputId = output.getServerId();
		var nRef = output.getNReference();
		var cjrRef = output.getCJRReference();
		var bulkPrint = output.getDoBulkPrint() ? "true" : "false";
		var printedFlag = WP.GetState(wpprocess, WPState.wps_Printed);
		var fienal = "Y";
		var params = new NonFormServiceParams();
		var finalFlag	= WP.GetState(wpprocess, WPState.wps_FIN);
		var documentId = "";
		if ("N" == finalFlag) {
			documentId = WP.GetState(wpprocess, WPState.wps_DocId);
			fienal = "N";	}
		else {
			documentId = WP.GetState(wpprocess, WPState.DocumentId); }
		if (top.doDebug) alert("Storing document Id: " +documentId);
		params.addSimpleParameter('outputId', '' + outputId);
		params.addSimpleParameter('documentId', '' + documentId);
		params.addSimpleParameter('final', '' + fienal);
		params.addSimpleParameter('printed', '' + printedFlag);
		params.addSimpleParameter('nreference', '' + nRef);
		params.addSimpleParameter('bulkprint', '' + bulkPrint);
		params.addSimpleParameter('cjrRef', '' + cjrRef);
		if (doLog) do_Log(msg+"calling service setDocument: " +  outputId + " / " + documentId);
		WPS.callService("setDocument", params, this, false); } 
	return this.getConditionFunction(wpprocess); }

/** 
 * @type Function
 * @returns the condition function - must return true upon evaluation untill the process continues
 */
CaseManWPProcessStep__SetDocument.prototype.getConditionFunction = function(wpprocess) {
	if (wpprocess.mustCreateReportNow()) {
		var stateId = wpprocess.getOutputStateId('SetDocumentDone');
		return new Function("return WP.CheckState('"+stateId+"', true);"); }
	else { 
		return new Function("return true;"); } }
	
/**
 */
CaseManWPProcessStep__SetDocument.prototype.onSuccess = function(dom, serviceName) {
	var msg = "CaseManWPProcessStep__SetDocument.prototype.onSuccess ";
	var process = this.getProcess();
	if (doLog) do_Log(msg + " for " + process); /** CAN BE VERY INEFFICIENT: + " : " + dom.xml**/
	WP.SetState(process, "SetDocumentDone", true); }