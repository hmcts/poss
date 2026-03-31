/**
 *	This file contains the global variables used by the
 *	SUPS Word Processing JavaScript classes which may be
 * 	altered/should be checked before starting the build process
 * @fileoverview
 */
 
/**
 * 'static' variable declaring whether or not to use the SUPS Framework Logging (default: true)
 */
var useFrameworkLogging = true; 
 
/**
 * intialised the doDebug and doLog switches from the application launchpad screen (index.html)
 */
function InitDebugLogSwitches() {
	var params = WP.GetURLParameters();
	var p1 = params['wpDBGwp'];
	p1 = 'true' == p1 ? true  : false;
	top.doDebug = p1;
	if (true == p1) alert("- Temporary Intitialisation Parameter -\n\nDebugging WP: " + top.doDebug + "\n");
	var log = true; //params['wpLog'];	
	if (true == log || false == log) top.doLog = log;
	top.InitDebugLogSwitchesDone =  true;
	doDebug = top.doDebug;
	doLog = top.doLog; }
	 
/**
 * Do Debugging
 */
doDebug = top.doDebug;

/**
 * Do Logging
 */
doLog = top.doLog;

/**
 * Logging window ref
 */
var doLogWin = null;

/**
 * Do Performance (monitoring)
 */
var doP = true; 

/**
 * Do (extensive) Try Catch
 * may lessen performance
 */
var doT = true;

/**
 * Implementing Not Implemented exceptions.
 * This static function MUST be used in abstract function bodies.
 */
function do_X(msg) {
	var x = "* Implementing Not Implemented exceptions.\n* This static function MUST be used in abstract function bodies."; }

/**
 * Delegating logging of message/err to framework
 */
function do_Log(msg, err) {
	if (useFrameworkLogging) {
		Logging.trace(msg, err);	}
	else {
		if (null == doLogWin) {
			doLogWin = window.open("","WPCTRLOG"); }
		d = doLogWin.document
		b = d.body;
		e = d.createElement("div");
		e.innerHTML = new Date() + " : "+  msg;
		b.insertBefore(e, b.firstChild); } }

/**
 * Implementing performance measurement
 */
function do_P(flg, msg) {}

/**
 * Static attribute used as flg attribute in doP(flg, msg) indicating start of performance check
 */
doP.Start = 0;

/**
 * Static attribute used as flg attribute in doP(flg, msg) indicating end of performance check
 */
doP.End = 1;