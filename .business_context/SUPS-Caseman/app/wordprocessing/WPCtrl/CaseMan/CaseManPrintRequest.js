/**
 *
 * @constructor
 */
function CaseManPrintRequest(contextxml, process) {
	WPSSRequest.apply(this, ["CaseManPrintRequest", contextxml, process]);	
}

/**
 *
 */
CaseManPrintRequest.prototype = new WPSSRequest("CaseManPrintRequest");

/**
 *
 */
CaseManPrintRequest.prototype.constructor = CaseManPrintRequest;

/**
 *
 */
CaseManPrintRequest.prototype.toString = function() {
	return "CaseManPrintRequest instance"; }


/**
 *
 */
CaseManPrintRequest.prototype.FindOutputToProcess = function(contextxml, process, wpctrl, outputClass) {
	var output = null;
	var config = wpctrl.getConfigXML();
	var seiNode = contextxml.selectSingleNode(CaseManWPXPath.EventStandardId);
	if (null == seiNode) 
	{
		var coeiNode = contextxml.selectSingleNode(CaseManWPXPath.COEventStandardId);
		if (null != coeiNode) 
		{
			var code = 1;
			var coeiValue = WPS.getNodeTextContent(coeiNode);
			
			//var codeNode = contextxml.selectSingleNode(CaseManWPXPath.COEventCode);
			//
			//if (null != codeNode) {
			//	code = WPS.getNodeTextContent(codeNode);
			//}
			if ("332" == coeiValue) code = 2;
			
			var outputNode = config.selectSingleNode(CaseManWPXPath._FindOutputForEventAndCode(coeiValue, code));
			if (null != outputNode) 
			{
				var id = outputNode.getAttribute("id");
				output = WPOutput.Instances[id];
				if (null == output) 
				{
					output = WPOutput.InitializeInstance(wpctrl, id, outputClass); 
				}
				if (doLog) do_Log("WPOutput.FindOutputToProcess loaded output " + output); 
			}
			else 
			{
				if (doLog) do_Log("WPOutput.FindOutputToProcess No outputnode for " + CaseManWPXPath._FindOutputForEvent(coeiValue)); 
			} 
		}
		else
		{
			/**what type of output???**/
		}
	}
	else
	{
		if (null != config && null != seiNode) 
		{
			var seiValue = WPS.getNodeTextContent(seiNode);
			var outputNode = config.selectSingleNode(CaseManWPXPath._FindOutputForEvent(seiValue));
			if (null != outputNode) 
			{
				var id = outputNode.getAttribute("id");
				output = WPOutput.Instances[id];
				if (null == output) 
				{
					output = WPOutput.InitializeInstance(wpctrl, id, outputClass); 
					if (doLog) do_Log("WPOutput.FindOutputToProcess loaded output " + output); 
				}
				else 
				{	
					if (doLog) do_Log("WPOutput.FindOutputToProcess No outputnode for " + CaseManWPXPath._FindOutputForEvent(seiValue)); 
				} 		
			} 
		}
	}
	return output; 
	}
	
/**
 * CaseManPrintRequest instance function returning null or an Array containing a process step and null or a condition-to-be-met-before-next-step-is-to-be-executed 
 * This function overrides thiw WPRequest function.
 * @type Array
 * @type WPOutput
 * @argument WPOutput output output handled by this request in the client application
 * @returns null || Array (containing step, [ null | condition ])
 */
CaseManPrintRequest.prototype.getNextStepAndCondition = function(output) {
	
}