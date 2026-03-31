/**
 * CaseMan Create Request.
 * Depending on the context xml passed in through the WP invocation API,
 * a Create, EditOrView or Print request is created for output processing.
 * The CaseMan Create Request involves following process steps:
 * - load data
 * - [ QA [input,save,save caseman business] ]
 * - reload data
 * - transform data
 * - [ edit output ]
 * - 
 * @constructor
 */
function CaseManQAOnlyRequest(contextxml, process) {
	WPMSRequest.apply(this, ["CaseManQAOnlyRequest",contextxml, process]);
}

/**
 *
 */
CaseManQAOnlyRequest.prototype = new WPMSRequest("CaseManQAOnlyRequest");

/**
 *
 */
CaseManQAOnlyRequest.prototype.constructor = CaseManQAOnlyRequest;

/**
 *
 */
CaseManQAOnlyRequest.prototype.toString = function() {
	return "CaseManQAOnlyRequest instance"; }

/**
 *
 */
CaseManQAOnlyRequest.prototype.FindOutputsToProcess = function(contextxml, process, wpctrl, outputClass) 
{	alert('CaseManQAOnlyRequest.prototype.FindOutputsToProcess has no outputs');	

}


	
/**
 * CaseManQAOnlyRequest instance function returning null or an Array containing a process step and null or a condition-to-be-met-before-next-step-is-to-be-executed 
 * This function overrides thiw WPRequest function.
 * @type Array
 * @type WPOutput
 * @argument WPOutput output output handled by this request in the client application
 * @returns null || Array (containing step, [ null | condition ])
 */
CaseManQAOnlyRequest.prototype.getNextStepAndCondition = function(output) {}