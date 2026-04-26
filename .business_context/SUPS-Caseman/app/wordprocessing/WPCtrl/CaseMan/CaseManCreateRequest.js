/**
 * CaseMan Create Request.
 * Depending on the context xml passed in through the WP invocation API,
 * a Create, EditOrView or Print request is created for output processing.
 * Change History
 * 27/11/2012 - Chris Vincent: Code now looks for the bulk printing attribute for the event 
 * and sets the output object accordingly.  Trac 4761
 * 28/01/2013 - Chris Vincent: Added code to handle case event 196 and the output variations with the case track.  Trac 4763.
 * 25/11/2015 - Chris Vincent: Bulk print change to turn opff bulk printing for CO event 332.  Trac 5725
 * @constructor
 */
function CaseManCreateRequest(contextxml, process) {
	WPMSRequest.apply(this, ["CaseManCreateRequest",contextxml, process]); }

/**
 * CaseManCreateRequest prototype object
 */
CaseManCreateRequest.prototype = new WPMSRequest("CaseManCreateRequest");

/**
 * CaseManCreateRequest prototype constructor object
 */
CaseManCreateRequest.prototype.constructor = CaseManCreateRequest;

/**
 * CaseManCreateRequest toString
 */
CaseManCreateRequest.prototype.toString = function() {
	return "CaseManCreateRequest instance"; }

/**
 * CaseManCreateRequest FindOutpusToprocess
 */
CaseManCreateRequest.prototype.FindOutputsToProcess = function(contextxml, process, wpctrl, outputClass) {	
	var outputs = new Array;
	var config = wpctrl.getConfigXML();
	var pkNode = contextxml.selectSingleNode(CaseManWPXPath.EventPK);
	if (null == pkNode) {
		var coeiNode = contextxml.selectSingleNode(CaseManWPXPath.COEventStandardId);
		if (null != coeiNode) {   
			var code = 1;
			var coeiValue = WPS.getNodeTextContent(coeiNode);			
			if( 332 == coeiValue ){ code = 2; }
		   	if ("105" == coeiValue) {
		    	output = WPOutput.InitializeInstance(wpctrl, "L_BLANK_CO", outputClass);
		    	outputs.push(output); }
		   	else { 			
				var outputNodes = config.selectNodes(CaseManWPXPath._FindOutputForEventAndCode(coeiValue, code));
				var outputNodeLen = outputNodes.length;
				for (var i=0; i <outputNodeLen; i++) {
					var outputNode = outputNodes[i];
					var id = outputNode.getAttribute("id");
					output = WPOutput.Instances[id];
					if (null == output) {
						output = WPOutput.InitializeInstance(wpctrl, id, outputClass); }
					
					var eventNode = config.selectSingleNode("configuration/events/event[@id='"+coeiValue+"'][@code='"+code+"']");
					if(null != eventNode) {	
						var bulkPrintAttNode = eventNode.selectSingleNode("@bulkprint");
						if (null != bulkPrintAttNode) {
							var bulkPrintAtt = XML.getNodeTextContent(bulkPrintAttNode);
							if ("true" == bulkPrintAtt) {
								output.setDoBulkPrint(true); } } }
						
					if (doLog) do_Log("WPOutput.FindOutputToProcess loaded output " + output); 
					var useCondition = false;
					var conditionIsMet = false;
					var condition = config.selectSingleNode(CaseManWPXPath._FindEventOutputCreationCondition(coeiValue, code));
					var conditionTxt = "";
					if (null != condition) conditionTxt = condition.nodeValue;
					if ("userPromptOK" == conditionTxt) {
						var outputText = output.toString();
						/** TD UCT 500 "Click OK to produce appeal notes letter, Cancel not to produce the output" **/
						if ("L_4_4" == output.getCJRReference()) {
							outputText == "appeal notes letter"; }
						conditionIsMet = true == confirm("Click OK to produce " + outputText + ",\nClick Cancel to not produce the output."); }
					if (!useCondition || (useCondition && conditionIsMet))	{
						outputs.push(output); } } } } }
	else {
		var seiNode = contextxml.selectSingleNode(CaseManWPXPath.EventStandardId);
		if (null != config && null != seiNode) 	{
			var seiValue = WPS.getNodeTextContent(seiNode);
			if (1 == seiValue)	{
				var caseType = XML.getNodeTextContent(contextxml.selectSingleNode(CaseManWPXPath.CaseType));
				var eventNode = null;
				var eventNodes = config.selectNodes("configuration/events/event[@id='"+seiValue+"'][./CaseTypes/CaseType = '"+caseType+"']");
				var eventNodesLen = eventNodes.length;
				if (0 == eventNodesLen) return false; 
				if (eventNodesLen > 1){
					var outputNode = eventNodes[0].selectSingleNode("Output");
					var outputId = outputNode.getAttribute("id");
					var x =1 ;				
					if ("CJR179" == outputId || "CJR187" == outputId) {
						var hearingNode = contextxml.selectSingleNode("WordProcessing/HearingCreated");
						if (null != hearingNode) {
							var hearingCreated = WPS.getNodeTextContent(hearingNode);
							if ("true"== hearingCreated) {
								eventNode = eventNodes[1]; }
							else {
								eventNode = eventNodes[0];  } }
						else {
							eventNode = eventNodes[0]; } } }				
				else {
					eventNode = eventNodes[0]; }
				if (null != eventNode) 	{
					var outputNodes = eventNode.selectNodes("Output");
					var outputNodesLen = outputNodes.length;
					if (doLog) do_Log("Found " + outputNodesLen + " output nodes under event / code "+seiValue+" / " + caseType);
					for (var i=0; i < outputNodesLen; i++)	{
						outputNode = outputNodes[i];
						outputId = XML.getNodeTextContent(outputNode.selectSingleNode("@id"));						
						output = WPOutput.Instances[outputId];
						if (null == output) {
							output = WPOutput.InitializeInstance(wpctrl, outputId, outputClass); }
						var ccbcAttNode = eventNode.selectSingleNode("@ccbc");
						if (null != ccbcAttNode) {
							var ccbcAtt = XML.getNodeTextContent(ccbcAttNode);
							if ("suppress" == ccbcAtt) {
								output.setDoCCBC(false); } }
						var bulkPrintAttNode = eventNode.selectSingleNode("@bulkprint");
						if (null != bulkPrintAttNode) {
							var bulkPrintAtt = XML.getNodeTextContent(bulkPrintAttNode);
							if ("true" == bulkPrintAtt) {
								output.setDoBulkPrint(true); } }
						if (doLog) do_Log("WPOutput.FindOutputToProcess loaded output " + output); 
						outputs.push(output); } } }
			else if (340 == seiValue || 350 == seiValue) {
				var transferReason = XML.getNodeTextContent(contextxml.selectSingleNode(CaseManWPXPath.TransferReason));
				var eventNode = null;
				var eventNodes = config.selectNodes("configuration/events/event[@id='"+seiValue+"'][./TransferReasons/TransferReason = '"+transferReason+"']");
				var eventNodesLen = eventNodes.length;
				if (1 == eventNodesLen) {
					eventNode = eventNodes[0];
					var outputNodes = eventNode.selectNodes("Output");
					var outputNodesLen = outputNodes.length;
					if (doLog) do_Log("Found " + outputNodesLen + " output nodes under event / code " + seiValue + " / " + transferReason);
					for (var i=0; i < outputNodesLen; i++) {
						outputNode = outputNodes[i];
						outputId = WPS.getNodeTextContent(outputNode.selectSingleNode("@id"));
						output = WPOutput.Instances[outputId];
						if (null == output) {
							output = WPOutput.InitializeInstance(wpctrl, outputId, outputClass); }
						var ccbcAttNode = eventNode.selectSingleNode("@ccbc");
						if (null != ccbcAttNode) {
							var ccbcAtt = XML.getNodeTextContent(ccbcAttNode);
							if ("suppress" == ccbcAtt) {
								output.setDoCCBC(false); } }
						var bulkPrintAttNode = eventNode.selectSingleNode("@bulkprint");
						if (null != bulkPrintAttNode) {
							var bulkPrintAtt = XML.getNodeTextContent(bulkPrintAttNode);
							if ("true" == bulkPrintAtt) {
								output.setDoBulkPrint(true); } }
						if (doLog) do_Log("WPOutput.FindOutputToProcess loaded output " + output); 
						outputs.push(output); } } }
			else if (140 == seiValue ) {		
				var applicantParty = XML.getNodeTextContent(contextxml.selectSingleNode(CaseManWPXPath.ctxApplicantParty));			
				/**if ("" == applicantParty  || null == applicantParty) debugger;**/
				var eventNode = null;			
				var eventNodes = config.selectNodes("configuration/events/event[@id='"+seiValue+"'][./ApplicantParty = '"+applicantParty +"']"); /** on hold:  **/
				var eventNodesLen = eventNodes.length;
				if (1 == eventNodesLen) {
					eventNode = eventNodes[0];
					var outputNodes = eventNode.selectNodes("Output");
					var outputNodesLen = outputNodes.length;
					if (doLog) do_Log("Found " + outputNodesLen + " output nodes under event / code " + seiValue + " / " + applicantParty );
					for (var i=0; i < outputNodesLen; i++) {
						outputNode = outputNodes[i];
						outputId = WPS.getNodeTextContent(outputNode.selectSingleNode("@id"));
						output = WPOutput.Instances[outputId];
						if (null == output) {
							output = WPOutput.InitializeInstance(wpctrl, outputId, outputClass); }
						var bulkPrintAttNode = eventNode.selectSingleNode("@bulkprint");
						if (null != bulkPrintAttNode) {
							var bulkPrintAtt = XML.getNodeTextContent(bulkPrintAttNode);
							if ("true" == bulkPrintAtt) {
								output.setDoBulkPrint(true); } }
						if (doLog) do_Log("WPOutput.FindOutputToProcess loaded output " + output); 
						outputs.push(output); }	} }	
			else if (196 == seiValue ) {		
				var track = XML.getNodeTextContent(contextxml.selectSingleNode(CaseManWPXPath.ctxTrack));			
				var eventNode = null;			
				var eventNodes = config.selectNodes("configuration/events/event[@id='"+seiValue+"'][./Tracks/Track = '"+track+"']");
				var eventNodesLen = eventNodes.length;
				if (1 == eventNodesLen) {
					eventNode = eventNodes[0];
					var outputNodes = eventNode.selectNodes("Output");
					var outputNodesLen = outputNodes.length;
					for (var i=0; i < outputNodesLen; i++) {
						outputNode = outputNodes[i];
						outputId = WPS.getNodeTextContent(outputNode.selectSingleNode("@id"));
						output = WPOutput.Instances[outputId];
						if (null == output) {
							output = WPOutput.InitializeInstance(wpctrl, outputId, outputClass); }
						var bulkPrintAttNode = eventNode.selectSingleNode("@bulkprint");
						if (null != bulkPrintAttNode) {
							var bulkPrintAtt = XML.getNodeTextContent(bulkPrintAttNode);
							if ("true" == bulkPrintAtt) {
								output.setDoBulkPrint(true); } }
						if (doLog) do_Log("WPOutput.FindOutputToProcess loaded output " + output); 
						outputs.push(output); }	} }			
			else if (100 == seiValue || 105 == seiValue)  {
			    var output = null;
			    var outputid = "";
			    var AENumberNode = contextxml.selectSingleNode("//AENumber");
			    var AENumber = "";
			    if (null!= AENumberNode) AENumber = WPS.getNodeTextContent(AENumberNode);
			    if (null != AENumber && "" != AENumber) {
			    	outputid = "L_BLANK_AE"; }
			    else {
					outputid = "L_BLANK";  }
			    output = WPOutput.InitializeInstance(wpctrl, outputid, outputClass); 
			    if (null != output)  {
			     if (doLog) do_Log("WPOutput.FindOutputToProcess loaded output " + output); 
			     outputs.push(output); } }
			else if (332 == seiValue)  {
			    var output = null;
			    var outputid = "CJR065C";
			    output = WPOutput.InitializeInstance(wpctrl, outputid, outputClass); 
					
				var AENumberNode = contextxml.selectSingleNode("//AENumber");
			    var AENumber = "";
			    if (null!= AENumberNode) AENumber = WPS.getNodeTextContent(AENumberNode);
			    if (null != AENumber && "" != AENumber) {
			    	output.setDoBulkPrint(true); }
					
			    if (null != output)  {
			     if (doLog) do_Log("WPOutput.FindOutputToProcess loaded output " + output); 
			     outputs.push(output); } }
			else if (111 == seiValue) {
				var output = null;
			    var outputid = "";
			 	var coSEIDNode = contextxml.selectSingleNode("//CONumber");
			 	var CONumber = "";
			 	if (null!= coSEIDNode) CONumber = WPS.getNodeTextContent(coSEIDNode);
			    if (null != CONumber && "" != CONumber) {
			    	outputid = "L_BLANK_CO"; }
			    else {
					outputid = "L_BLANK";  }
			    output = WPOutput.InitializeInstance(wpctrl, outputid, outputClass);
				// Note that the only event 111 node in the config file is the CO Event 111 (L_BLANK_CO)
				var eventNode = config.selectSingleNode("configuration/events/event[@id='"+seiValue+"'][@code='1']");
				if(null != eventNode) {
					var bulkPrintAttNode = eventNode.selectSingleNode("@bulkprint");
					if (null != bulkPrintAttNode) {
						var bulkPrintAtt = XML.getNodeTextContent(bulkPrintAttNode);
						if ("true" == bulkPrintAtt) {
							output.setDoBulkPrint(true); } } }
				
			    if (null != output)  {
			     if (doLog) do_Log("WPOutput.FindOutputToProcess loaded output " + output); 
			     outputs.push(output); } }
			else{
				var eventCode = 1;
				var eventNode = config.selectSingleNode("configuration/events/event[@id='"+seiValue+"'][@code='"+eventCode+"']");
				if(null != eventNode) {
					var outputNodes = eventNode.selectNodes("Output");
					var outputNodesLen = outputNodes.length;
					if (doLog) do_Log("Found " + outputNodesLen + " output nodes under event / code " + seiValue + " / " + eventCode);
					for (var i=0; i < outputNodesLen; i++) {
						outputNode = outputNodes[i];
						outputId = XML.getNodeTextContent(outputNode.selectSingleNode("@id"));
						/** Have we been called from the judgment screen? **/
						var isJudgment = (null != contextxml.selectSingleNode("//JudgmentId"));   
						if ((seiValue == '230' || seiValue == '240' || seiValue == '250' ) && isJudgment)	{
							/** If this has been called from the judgments screen then 
							    event 230 results in CJR040a, event 240 results in CJR041a and event 250 results in CJR042a**/
							outputId += "a"; }						
						output = WPOutput.Instances[outputId];
						if (null == output) {
							output = WPOutput.InitializeInstance(wpctrl, outputId, outputClass); }
							
						if ((seiValue == '230' || seiValue == '240' || seiValue == '250') && isJudgment)	{
							/** If this has been called from the judgments screen then 
							    event 230 results in CJR040a, event 240 results in CJR041a and event 250 results in CJR042a 
							    THESE SHOULD NOT BE SUPPRESSED**/
							output.setDoCCBC(true); }						
						else {
							/** setting CCBC suppress immediate output flag **/
							var ccbcAttNode = eventNode.selectSingleNode("@ccbc");
							if (null != ccbcAttNode) {
								var ccbcAtt = XML.getNodeTextContent(ccbcAttNode);
								if ("suppress" == ccbcAtt) {
									output.setDoCCBC(false); } } }
												
						var bulkPrintAttNode = eventNode.selectSingleNode("@bulkprint");
						if (null != bulkPrintAttNode) {
							var bulkPrintAtt = XML.getNodeTextContent(bulkPrintAttNode);
							if ("true" == bulkPrintAtt) {
								output.setDoBulkPrint(true); 
							} 
						}
						
						if ((seiValue == '230' || seiValue == '240' || seiValue == '250') && isJudgment)	{
							/** If this has been called from the judgments screen then 
							    event 230 results in CJR040a, event 240 results in CJR041a and event 250 results in CJR042a 
							    THESE SHOULD NOT BE BULK PRINTED**/
							output.setDoBulkPrint(false); }
								
						if (doLog) do_Log("WPOutput.FindOutputToProcess loaded output " + output); 		
						var useCondition = false;
						var conditionIsMet = false;
						var condition = config.selectSingleNode(CaseManWPXPath._FindEventOutputCreationCondition(seiValue, eventCode));
						var conditionTxt = "";
						if (null != condition) conditionTxt = condition.nodeValue;
						if ("userPromptOK" == conditionTxt) {
							useCondition = true;
							var outputText = output.toString();
							/** TD UCT 500 "Click OK to produce appeal notes letter, Cancel not to produce the output" **/
							if ("L_4_4" == output.getCJRReference()) {
								outputText == "appeal notes letter"; }
							conditionIsMet = true == confirm("Click OK to produce " + outputText + ",\nClick Cancel to not produce the output."); }
						if (!useCondition || (useCondition && conditionIsMet))	{
							outputs.push(output); } } } } } }	
	return outputs; }

/**
 * CaseManCreateRequest instance function returning null or an Array containing a process step and null or a condition-to-be-met-before-next-step-is-to-be-executed 
 * This function overrides thiw WPRequest function.
 * @type Array
 * @type WPOutput
 * @argument WPOutput output output handled by this request in the client application
 * @returns null || Array (containing step, [ null | condition ])
 */
CaseManCreateRequest.prototype.getNextStepAndCondition = function(output) {}