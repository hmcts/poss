/**
 * CaseManEditOrViewRequest class, representing the request for processing to open an exisint CaseMan WPOutput.
 * The WPOutput may be reopened for editing (if the output isn't Final yet) or viewing (pdf rendition)
 * Change History
 * 27/11/2012 - Chris Vincent: Code now looks for the bulk printing attribute for the event 
 * and sets the output object accordingly.  Trac 4761
 * 28/01/2013 - Chris Vincent: Added code to handle case event 196 and the output variations with the case track.  Trac 4763.
 * @constructor
 */
function CaseManEditOrViewRequest(contextxml, process) {
	WPMSRequest.apply(this, ["CaseManEditOrViewRequest", contextxml, process]);	}

/**
 * CaseManEditOrViewRequest class super/prototype 
 */
CaseManEditOrViewRequest.prototype = new WPMSRequest("CaseManEditOrViewRequest");

/**
 * CaseManEditOrViewRequest constructor
 */
CaseManEditOrViewRequest.prototype.constructor = CaseManEditOrViewRequest;

/**
 * CaseManEditOrViewRequest toString - returning 'aCaseManEditOrViewRequest'
 */
CaseManEditOrViewRequest.prototype.toString = function() {
	return "aCaseManEditOrViewRequest"; }

/**
 * CaseManEditOrViewRequest FindOutputsToProcess 
 */
CaseManEditOrViewRequest.prototype.FindOutputsToProcess = function(contextxml, process, wpctrl, outputClass) {
	var x = new Array();
	x[x.length] = this.FindOutputToProcess(contextxml, process, wpctrl, outputClass);
	return x; }

/**
 * CaseManEditOrViewRequest FindOutputToProcess - should not use anymore - rather use .FindOutputsToProcess
 * internal function used by FindOutputsToProcess)
 */
CaseManEditOrViewRequest.prototype.FindOutputToProcess = function(contextxml, process, wpctrl, outputClass) {
	var output = null;
	var outputid = ""
	var config = wpctrl.getConfigXML();
	var finalFlagNode = contextxml.selectSingleNode(CaseManWPXPath.FinalFlag);
	if (null != finalFlagNode)  {
		if (null != config)  {
			var finalFlagValue = WPS.getNodeTextContent(finalFlagNode);			
			var eventSeq = WP.GetContextValue(contextxml, CaseManWPXPath.EventStandardId);
			/** CO Event determination **/
			var isCOEvent = false;
			var coEventSeqNode = contextxml.selectSingleNode(CaseManWPXPath.COEventPK);
			var coEventSeq = null;
			if (null != coEventSeqNode) {
				coEventSeq = WPS.getNodeTextContent(coEventSeqNode);
				if ("" != coEventSeq) isCOEvent = true; }
			/** AE Event determination **/			
			var isAEEvent = false;
			var AENumberNode = contextxml.selectSingleNode(CaseManWPXPath.AENumber);
			var AENumber = null;
			if (null != AENumberNode) {
				AENumber = WPS.getNodeTextContent(AENumberNode);
				if ("" != AENumber) isAEEvent = true; }
			/** Warrant Return determination **/
			/** Debug Information **/
			if (doLog) do_Log("CaseManEditOrViewRequest.prototype.FindOutputToProcess: CO: " + isCOEvent + "\nAE: " + isAEEvent); 		
			/** Find Output to process **/
			if (null == eventSeq) {
				if (top.doDebug) alert("null event seq // can this happen though ? perhaps shortly with warrant return outputs for edit/reopening via grid");
				if ("105" == coeiValue) {
					output = WPOutput.InitializeInstance(wpctrl, "L_BLANK_CO", outputClass); } }
			else {
				if (100 == eventSeq || 105 == eventSeq) {
					if (true == isAEEvent) { outputid = "L_BLANK_AE"; }
				    else {				     outputid = "L_BLANK"; }
				    // outputid = "L_BLANK";
				    output = WPOutput.InitializeInstance(wpctrl, outputid, outputClass);
				    if (null != output && doLog) do_Log("CaseManEditOrViewRequest.prototype.FindOutputToProcess loaded output " + output); }
				else if (332 == eventSeq)  { /** TD 5332 **/
					var code = 1; 
					if (true == isCOEvent) code = 2;
					var outputNode = config.selectSingleNode(CaseManWPXPath._FindOutputForEventAndCode(eventSeq, code));
					if (null != outputNode) {
						var id = outputNode.getAttribute("id");
						output = WPOutput.Instances[id]; 
						if (null == output) {
							output = WPOutput.InitializeInstance(wpctrl, id, outputClass);

							var eventNode = config.selectSingleNode("configuration/events/event[@id='"+eventSeq+"'][@code='"+code+"']");
							if(null != eventNode) {
								var bulkPrintAttNode = eventNode.selectSingleNode("@bulkprint");
								if (null != bulkPrintAttNode) {
									var bulkPrintAtt = XML.getNodeTextContent(bulkPrintAttNode);
									if ("true" == bulkPrintAtt) {
										output.setDoBulkPrint(true); } } }
							
							// Hard code AE Event 332 to be bulk printed
							if (true == isAEEvent) { output.setDoBulkPrint(true); }
							
							if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess loaded output " + output); }
						else {	
							if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess No outputnode for " + CaseManWPXPath._FindOutputForEventAndCode(coeiValue, code)); } }	
					else {
						if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess No outputnode for " + CaseManWPXPath._FindOutputForEventAndCode(coeiValue, code)); } }		
				else if (111 == eventSeq) {
					if (true == isCOEvent) { outputid = "L_BLANK_CO"; }
				    else {				     outputid = "L_BLANK"; }
				    output = WPOutput.InitializeInstance(wpctrl, outputid, outputClass); 
					// Note that the only event 111 node in the config file is the CO Event 111 (L_BLANK_CO)
					var eventNode = config.selectSingleNode("configuration/events/event[@id='"+eventSeq+"'][@code='1']");
					if(null != eventNode) {
						var bulkPrintAttNode = eventNode.selectSingleNode("@bulkprint");
						if (null != bulkPrintAttNode) {
							var bulkPrintAtt = XML.getNodeTextContent(bulkPrintAttNode);
							if ("true" == bulkPrintAtt) {
								output.setDoBulkPrint(true); } } }
				    if (null != output && doLog) do_Log("CaseManEditOrViewRequest.prototype.FindOutputToProcess loaded output " + output);
				}
				else if (340 == eventSeq || 350 == eventSeq) {
					var transferReasonNode = contextxml.selectSingleNode("/WordProcessing/Event/TransferReason");
					var transferReason = "";
					if (null!= transferReasonNode) { transferReason = WPS.getNodeTextContent(transferReasonNode); }
					if (null != transferReason && "" != transferReason)
					{
						// Transfer Reason supplied
						var outputNode = config.selectSingleNode("configuration/events/event[@id='"+eventSeq+"' and ./TransferReasons/TransferReason='"+transferReason+"']/Output");
						if (null != outputNode) {
							var id = outputNode.getAttribute("id");
							output = WPOutput.Instances[id];
							if (null == output) {
								output = WPOutput.InitializeInstance(wpctrl, id, outputClass);
								var eventNode = config.selectSingleNode("configuration/events/event[@id='"+eventSeq+"' and ./TransferReasons/TransferReason='"+transferReason+"']");
								if(null != eventNode) {
									var bulkPrintAttNode = eventNode.selectSingleNode("@bulkprint");
									if (null != bulkPrintAttNode) {
										var bulkPrintAtt = XML.getNodeTextContent(bulkPrintAttNode);
										if ("true" == bulkPrintAtt) {
											output.setDoBulkPrint(true); } } }
								if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess loaded output " + output); }
							else {	
								if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess No outputnode for " + CaseManWPXPath._FindOutputForEvent(finalFlagValue)); } }
						else  {
							if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess No outputnode for " + CaseManWPXPath._FindOutputForEvent(finalFlagValue)); }
					}
					else
					{
						// No transfer reason
						var outputNode = config.selectSingleNode(CaseManWPXPath._FindOutputForEvent(eventSeq));
						if (null != outputNode) {
							var id = outputNode.getAttribute("id");
							output = WPOutput.Instances[id];
							if (null == output) {
								output = WPOutput.InitializeInstance(wpctrl, id, outputClass); 
								if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess loaded output " + output); }
							else {	
								if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess No outputnode for " + CaseManWPXPath._FindOutputForEvent(finalFlagValue)); } }
						else  {
							if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess No outputnode for " + CaseManWPXPath._FindOutputForEvent(finalFlagValue)); }
					}
				}
				else if (196 == eventSeq) {
					var trackNode = contextxml.selectSingleNode("/WordProcessing/Case/Track");
					var track = "";
					if (null!= trackNode) { track = WPS.getNodeTextContent(trackNode); }
					if (null != track && "" != track)
					{
						// Track supplied
						var outputNode = config.selectSingleNode("configuration/events/event[@id='"+eventSeq+"' and ./Tracks/Track='"+track+"']/Output");
						if (null != outputNode) {
							var id = outputNode.getAttribute("id");
							output = WPOutput.Instances[id];
							if (null == output) {
								output = WPOutput.InitializeInstance(wpctrl, id, outputClass);
								var eventNode = config.selectSingleNode("configuration/events/event[@id='"+eventSeq+"' and ./Tracks/Track='"+track+"']");
								if(null != eventNode) {
									var bulkPrintAttNode = eventNode.selectSingleNode("@bulkprint");
									if (null != bulkPrintAttNode) {
										var bulkPrintAtt = XML.getNodeTextContent(bulkPrintAttNode);
										if ("true" == bulkPrintAtt) {
											output.setDoBulkPrint(true); } } }
								if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess loaded output " + output); }
							else {	
								if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess No outputnode for " + CaseManWPXPath._FindOutputForEvent(finalFlagValue)); } }
						else  {
							if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess No outputnode for " + CaseManWPXPath._FindOutputForEvent(finalFlagValue)); }
					}
					else
					{
						// No track
						var outputNode = config.selectSingleNode(CaseManWPXPath._FindOutputForEvent(eventSeq));
						if (null != outputNode) {
							var id = outputNode.getAttribute("id");
							output = WPOutput.Instances[id];
							if (null == output) {
								output = WPOutput.InitializeInstance(wpctrl, id, outputClass); 
								if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess loaded output " + output); }
							else {	
								if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess No outputnode for " + CaseManWPXPath._FindOutputForEvent(finalFlagValue)); } }
						else  {
							if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess No outputnode for " + CaseManWPXPath._FindOutputForEvent(finalFlagValue)); }
					}
				}
				else if (1 == eventSeq) /** TD 5734/5827**/
				{		
					var caseType = WP.GetContextValue(contextxml, CaseManWPXPath.CaseType);	
					var outputNodes = config.selectNodes(CaseManWPXPath._FindOutputForEventAndCaseType(eventSeq, caseType));
					var outputNode = null;
					// Handle the situation where there is > 1 output for the case type. This only happens for outputs
					// CJR179 and CJR187. We decide which output to create based on the presence of a hearing. If a hearing
					// is present then we choose CJR187 otherwise CJR179.
					if (outputNodes.length == 2)
					{
						var outputId = outputNodes[0].getAttribute("id");
						if ("CJR179" == outputId || "CJR187" == outputId) 
						{
							var hearingNode = contextxml.selectSingleNode("WordProcessing/HearingCreated");
							if (null != hearingNode) 
							{
								var hearingCreated = WPS.getNodeTextContent(hearingNode);
								if ("true" == hearingCreated) 
								{
									// CJR187 is always in 2nd position because of where it is in the xml
									outputNode = outputNodes[1]; 
								}
								else 
								{
									// CJR179 is always in 1st position because of where it is in the xml								
									outputNode = outputNodes[0];  
								} 
							}
							else 
							{
								outputNode = outputNodes[0]; 
							} 
						} 
					}
					// Handle the normal situation when there is only 1 output for the case type				
					else 
					{
						outputNode = outputNodes[0]; 
					}

					if (null != outputNode) 
					{
						var id = outputNode.getAttribute("id");
						output = WPOutput.Instances[id];
						if (null == output) 
						{
							output = WPOutput.InitializeInstance(wpctrl, id, outputClass); 
							
							var eventNode = config.selectSingleNode("configuration/events/event[@id='1'][./Output[@id='"+id+"']]");
							if(null != eventNode) {
								var bulkPrintAttNode = eventNode.selectSingleNode("@bulkprint");
								if (null != bulkPrintAttNode) {
									var bulkPrintAtt = XML.getNodeTextContent(bulkPrintAttNode);
									if ("true" == bulkPrintAtt) {
										output.setDoBulkPrint(true); } } }
							
							if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess loaded output " + output); 
						}
						else 
						{	
							if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess No outputnode for " + CaseManWPXPath._FindOutputForEvent(finalFlagValue)); 
						} 
					}

				}							
				else {			
					var outputNode = config.selectSingleNode(CaseManWPXPath._FindOutputForEvent(eventSeq));
					if (null != outputNode) {
						var id = outputNode.getAttribute("id");
						output = WPOutput.Instances[id];
						if (null == output) {
							output = WPOutput.InitializeInstance(wpctrl, id, outputClass); 
							
							var eventNode = config.selectSingleNode("configuration/events/event[@id='"+eventSeq+"'][@code='1']");
							if(null != eventNode) {
								var bulkPrintAttNode = eventNode.selectSingleNode("@bulkprint");
								if (null != bulkPrintAttNode) {
									var bulkPrintAtt = XML.getNodeTextContent(bulkPrintAttNode);
									if ("true" == bulkPrintAtt) {
										output.setDoBulkPrint(true); } } }
							
							if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess loaded output " + output); }
						else {	
							if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess No outputnode for " + CaseManWPXPath._FindOutputForEvent(finalFlagValue)); } }
					else  {
						if (doLog) do_Log("CaseManEditOrViewRequest.FindOutputToProcess No outputnode for " + CaseManWPXPath._FindOutputForEvent(finalFlagValue)); } } } } }
	return output; }

/**
 * CaseManEditOrViewRequest instance function returning null or an Array containing a process step and null or a condition-to-be-met-before-next-step-is-to-be-executed 
 * This function overrides thiw WPRequest function.
 * @type Array
 * @type WPOutput
 * @argument WPOutput output output handled by this request in the client application
 * @returns null || Array (containing step, [ null | condition ])
 */
CaseManEditOrViewRequest.prototype.getNextStepAndCondition = function(output) { }
