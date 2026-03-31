/**
 * SUPS Word Processing Request
 *
 *
 * @constructor
 */
function WPRequest(subclassname, contextxml, process) {
	/**
	 * Reference to the ('most final') subclass implementing this class
	 */
	this.impl = subclassname;
	/**
	 * The Word Processing output this request is handling
	 */
	this.output = null;
	/**
	 * The context xml fed into WP
	 */
	this.context = contextxml;
	/**
	 * The process this request is running
	 */
	this.process = process;
}

/**
 * SUPS Word Processing Request
 *
 */
WPRequest.prototype.constructor = WPRequest;

/**
 * SUPS Word Processing Request
 * @type String
 * @returns String representation of this Word Processing Single Step Request instance
 */
WPRequest.prototype.toString = function() {
	return "WPRequest"; }
	
/**
 * SUPS Word Processing Request function returning the contextxml passed into wp.
 * @type DOM
 * @returns contextxml DOM
 */
WPRequest.prototype.getContext = function() {
	return this.context; }
	
/**
 * SUPS Word Processing Request instance function
 *
 */
WPRequest.prototype.process = function() {
	doX("WPRequest subclasses MUST override WPRequest.prototype.process"); }


/**
 * SUPS Word Processing Request instance function returing the output this request is handling the processing for
 * @type WPOutput
 * @returns WPOutput output 
 */
WPRequest.prototype.getOutput = function() {
	return this.output;	
}

/**
 * SUPS Word Processing Request instance function setting the output this request is handling the processing for
 * @argument WPOutput output
 * @returns void
 */
WPRequest.prototype.setOutput = function(output) {
	this.output = output;	
}


/**
 * SUPS Word Processing Request instance function returning null or an Array containing a process step and null or a condition-to-be-met-before-next-step-is-to-be-executed 
 * Subclasses must override this function!
 * @type Array
 * @type WPOutput
 * @argument WPOutput output output handled by this request in the client application
 * @returns null || Array (containing step, [ null | condition ])
 */
WPRequest.prototype.getNextStepAndCondition = function(output) {
	doX("WPRequest subclasses MUST override WPRequest.prototype.getNextStepAndCondition"); }


/**
 * SUPS Word Processing Request instance function returning null or the output for which this request/process is
 * @type WPOutput
 * @argument contextxml
 * @argument process
 * @argument wpctrl
 * @argument output class name
 
 * @returns null || WPOutput instance
 */	
WPRequest.prototype.getOutputToProcess = function(contextxml, process, wpctrl) {
	doX("WPRequest subclasses MUST override WPRequest.prototype.getOutputToProces"); }



/**
 * Word Processing Multi Step Request
 * @constructor
 */
function WPMSRequest(subclassname, contextxml, process) {
	WPRequest.apply(this, [subclassname, contextxml, process]);
}

/**
 * Word Processing Multi Step Request
 *
 */
WPMSRequest.prototype = new WPRequest();

/**
 * Word Processing Multi Step Request
 *
 */
WPMSRequest.prototype.constructor = WPMSRequest;

/** 
 * Word Processing Multi Step Request instance function
 * @type String
 * @returns String representation of this Word Processing Single Step Request instance 
 */
WPMSRequest.prototype.toString = function() {
	return "WPSSRequest";
}

/**
 * Word Processing Multi Step Request instance function
 *
 */
WPMSRequest.prototype.process = function() {

}



/**
 * Word Processing Single Step Request
 * @constructor
 */
function WPSSRequest(subclassname, contextxml, process) {
	WPRequest.apply(this, [subclassname, contextxml, process]);
}

/**
 * Word Processing Single Step Request instance function
 *
 */
WPSSRequest.prototype = new WPRequest();

/**
 * Word Processing Single Step Request instance function
 *
 */
WPSSRequest.prototype.constructor = WPSSRequest;

/** 
 * Word Processing Single Step Request instance function
 * @type String
 * @returns String representation of this Word Processing Single Step Request instance 
 */
WPSSRequest.prototype.toString = function() {
	return "WPSSRequest"; }

/**
 * Word Processing Single Step Request instance function
 *
 */
WPSSRequest.prototype.process = function() {
}

