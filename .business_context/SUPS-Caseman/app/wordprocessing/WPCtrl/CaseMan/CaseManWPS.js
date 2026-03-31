/**
 * The CaseMan WP Services class represents the interface for all WP code to access
 * javascript functionality not part of the javascript spec, e.g. custom functions,
 * access to the SUPS Frameworks (where WPFW does not yet provide for them)
 */
function CaseManWPS() {
	
}

/**
 *
 */
CaseManWPS.prototype = new WPS();

/**
 *
 */
CaseManWPS.prototype.constructor = CaseManWPS;

/**
 *
 */
CaseManWPS.createDOM = function(a,b,c) {
	return WPS.createDOM(a,b,c);		
}