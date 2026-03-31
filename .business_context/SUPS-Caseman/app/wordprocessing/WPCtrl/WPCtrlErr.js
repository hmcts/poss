/**
 * SUPS Word Processing Controller Errors
 */
function WPCtrlErr(message, cause) {
	this.message = message;
	this.cause = cause;

	
}

/**
 *Word Processing Output configuration file loading failed.
 */
WPCtrlErr.____1 = "Word Processing Controller configuration file loading failed.";
/**
 *Word Processing Controller (subclass)'s doprocess() throws exception.
 */
WPCtrlErr.____2 = "Word Processing Controller (subclass)'s doprocess() throws exception.";
/**
 *Word Processing Output configuration file loading failed; no configuration root element found
 */
WPCtrlErr.____3 = "Word Processing Controller configuration file loading failed; no configuration root element found.";
/**
 *Word Processing Output configuration file loading failed; no configuration root element found
 */
WPCtrlErr.____4 = "Word Processing Controller configuration file basic parsing failed.";
/**
 *Word Processing Process configuration failed
 */
WPCtrlErr.____5 = "Word Processing Process configuration failed.";

/**
* Context Node does not contain an Event ID node!!
*/
WPCtrlErr.____6 = "ContextXml Node does not contain an Event ID node";
