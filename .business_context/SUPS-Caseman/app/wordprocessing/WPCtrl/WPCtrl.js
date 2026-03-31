/**
 * SUPS Word Processing Controller.
 * <pre> The Word Processing controller is instanatiated by the WP.InitController function.</pre>
 * @see WP.InitController
 * @constructor
 */
function WPCtrl(appCtrl) {
	/**
	 * Attribute DOM containing the controller configuration
	 */
	this.configxml = null;
	/**
	 * Attribute boolean indicating completion of initialisation of the controller
	 */
	this.initialized = false;
	/**
	 * Attribute storing reference to the SUSPS Application Controller (instance)
	 */
	this.appCtrl = appCtrl;
	 /**
	  * Attribute boolean indicating whether or not the request polling process is running
	  */
	this.runProcess = false;
	/**
	 * Attribute array storing the WPProcess (subclass) instances
	 * the index is actually the name of the process, which prevents iterating on this array,
	 * which is why we've got the processDefsA attribute
	 */
	this.processDefs = new Array();
	/**
	 * Attribute array storing the WPProcess (subclass) instances
	 * can iterate on this one, not on the processDefs attribute
	 */
	this.processDefsA = new Array();
	 /**
	  * Attribute array representing the queue of requests for processing
	  */
	this.processQ = new Array(); 
	/**
	 * Attribute referencing the process for which the qa screen is shown in the app
	 */
	this.processOnScreen = null;
	/**
	 * Attribute indicating the number of popup windows for wp - used as part of the id of the wp popup win
	 */
	this.pdfwindowcount = 0;
	 /**
	  * Initialize the controller, trigger, if there is one, initialize() function of the subclass controller
	  */
	this.initializeMe();
	 /**
	  * If initialized ok, start processing, else 'make some noise'
	  */
	if (null != appCtrl) {
		if (true == this.initialized) {
	 		this.startProcess(); }
		else {
		 	var str = this + "The Word Processing Controller did not complete initialisation.";
	 		if (doLog) do_Log(str); } } }


/**
 * singleton Process Q
 */
WPCtrl.ProcessQ = new Array();
 
/**
 * Setting the superclass
 */
WPCtrl.prototype = new WP();

/**
 * Instance attribute refering to the Class' constructor
 */
WPCtrl.prototype.constructor = WPCtrl;

/**
 * Attribute storing the frequency with which the controller's processing works.
 */
WPCtrl.Frequency = 400;

/**
 * Attribute storing the WPCtrl singleton instance
 */
WPCtrl.Instance = null;

/**
 * Attribute storing the WPCtrl state 
 */
WPCtrl.State = new Array();

/**
 * SUPS Word Processing Controller singlton access
 * All access to the wpctrl (and all instances of it's subclasses)
 * must use this function to retrieve the singleton instance.
 * @returns WPCtrl
 */
WPCtrl.GetInstance = function() {
	if (null == WPCtrl.Instance) {
		var str = "WPCtrl.GetInstance() called before singleton wp controller created."
	 	if (doLog) do_Log(str); } 
	return WPCtrl.Instance; }
	 WPCtrl.prototype._getSUPSReportServerURL
	 
/**
 * SUPS Word Processing Controller private function 
 * In use by the WP API. But it's abstract, or it should
 * be, so it's delegating to a 'true' abstract method:
 */
WPCtrl.prototype._getSUPSReportServerURL = function() {
	return this.getSUPSReportServerURL(); }

/**
 * SUPS Word Processing Controller function returning the URL pointing at the
 * root of the SUPS Word Processing Report Server.
 * @type String
 * @returns the url pointing at the SUPS WP Report Server
 */
WPCtrl.prototype.getSUPSReportServerURL = function () {
	 var str = "SUPS Application specific controllers must implement the .getSUPSReportServerURL function";
	 do_X(str); }
	
/**
 * SUPS Word Processing Controller private function, invoked by the WP API.
 * Used to Fix HTML to XHTML, delegating to this.FixHTML
 */
WPCtrl.prototype._FixHTML = function(html) {
	return this.FixHTML(html); }
	
/**
 * SUPS Word Processing Controller abstract function, used to Fix HTML to XHTML.
 * Application specific subclasses of the WPCtrl must implement this method.
 */
WPCtrl.prototype.FixHTML = function(html) {
	 var str = "SUPS Application specific controllers must implement the .FixHTML function";
	 do_X(str); }



/**
 * SUPS Word Processing Controller intialization function, called by the WPCtrl internals, and invokes the initialize() (if any) on the subclass controller.
 * Subclasses MUST NOT override this method.

 * Subclass intialize method should throw following errors:
 * throws: WPCtrlErr.____1 : Configuration file loading failed
 */
WPCtrl.prototype.initializeMe = function() {
	if (doLog) do_Log(this + " initializeMe starts");
	try {
		this.initialized = true;
		if (this.initialize) {
			try {
				this.initialize(); 
				WPCtrl.Instance = this; }
			catch (error) {
				this.initialized = false;
				var str = this + " WPCtrl.prototype.initializeMe caught exception from subclass intialize()";
				if (doLog) do_Log(str, error); } }
		else {
			WPCtrl.Instance = this;  }  }
	catch (err) {
		var str = this.toString + " WPCtrl.prototype.initializeMe caught exception";
		if (doLog) do_Log(str, err);  } 
	if (doLog) do_Log(this + " initializeMe finished"); }

/**
 * SUPS Word Processing Controller function, clearing all memory / shutting down / returning true.
 * @type boolean
 * @returns boolean indicating sucessfull shutdown
 */
WPCtrl.prototype.shutdown = function() {
	return true; }
		
/**
 * SUPS Word Processing Controller function, returning the configuration xml
 * Do not override
 * @type DOM
 * @returns DOM with the controller's configuration xml
 */
WPCtrl.prototype.getConfigXML = function() {
	return this.configxml; }

/**
 * SUPS Word Processing Controller function, called by the WPCtrl internals, 
 * starts the process that polls the request queue for processing to do.
 * Do not override
 */
WPCtrl.prototype.startProcess = function() {
	if (doLog) do_Log(this + " startProcess()")
	this.runProcess = true;
	WPCtrl.TriggerProcess(); }

/**
 * SUPS Word Processing Controller function, called by the WPCtrl internals, 
 * stops the process that polls the request queue for processing to do.
 * Do not override
 */
WPCtrl.prototype.stopProcess = function() {
	if (doLog) do_Log(this + " stopProcess()")
	this.runProcess = false; }

/**
 * SUPS Word Processing Controller function, called by the WPCtrl internals, 
 * part of the process that polls the request queue for processing to do.
 * When the runProcess instance variable is true, the next processing step will be timedout 
 * for execution in WPCtrl.Frequency milliseconds.
 * Do not override
 */
WPCtrl.TriggerProcess = function() {	
	//if (doLog) do_Log("WPCtrl.TriggerProcess() [runProcess="+ WPCtrl.Instance.runProcess+", Fq= "+WPCtrl.Frequency+"]")
	if (true == WPCtrl.Instance.runProcess) {
		setTimeout("WPCtrl.DoProcess()",WPCtrl.Frequency); } }

WPCtrl.DoProcessLastTriedOra = true;

/**
 *
 */
WPCtrl.PreProcess = function() {
	var msg = "WPCtrl.PreProcess() ";
/** try 
	{ 	
		if (doLog) do_Log(msg); **/
		var pro = WPCtrl.ProcessQ.shift();
		if (null != pro) {
			/**if (doLog) do_Log(msg+"pro = " +pro);**/
			var okToRunProcess = true;
			if(pro.length && pro.pop) {
				/** if array request, then there is a condition to be matched before this request can be processed **/
				var ctrl = pro[2]; /** the controller instance **/
				var dis = ctrl.toString();
				/**if (doLog) do_Log(msg+"pro Ctrl = " +dis);**/
				var con = pro[0]; /** condition **/
				if (doLog) do_Log(msg+"pro con = " +con);			
				var rrq = pro[1]; /** real request **/
				/**if (doLog) do_Log(msg+"pro pro = " +rrq);**/
				okToRunProcess = ((null == con) ? true : con.apply(null, [rrq]));
				if (doLog) do_Log(dis+" preProcess() condition check " + okToRunProcess + " for " + rrq); 
				if (okToRunProcess)	{
					ctrl.setScreenProcess(rrq);
					rrq.doprocess(ctrl); }
			 	else { 
			 		WPCtrl.ProcessQ.unshift(pro); 
			 		/**WPCtrl.EndRunningProcess(ctrl);**/ } } } 
	/**	else {
	 		WPCtrl.EndRunningProcess(this);	} }
	catch (err) {
		var str = this+".preProcess caught exception, throwing it up";
	 	if (doLog) do_Log(str, err);
		throw(err); } **/
}

/**
 * SUPS Word Processing Controller function, called by the WPCtrl internals, 
 * part of the process that polls the request queue for processing to do.
 * This function invokes the subclass/concrete controller's prototype process() function,
 * catches any errors and debugs/logs these, and then triggers the next process step.
 * Do not override
 */
WPCtrl.DoProcess = function() {
	WPCtrl.PreProcess();
/** if (doLog) do_Log("WPCtrl.DoProcess()")
	try {
		if (null != WPCtrl.CtrlRunningProcess) {
			WPCtrl.CtrlRunningProcess.preProcess();
			mayI = true; }
		else {
			if (false == WPCtrl.DoProcessLastTriedOra && true == top.WPCtrl.CaseManWPDIDSOMETHING) {	
				var ctrl = WP.GetInstance("OracleReportController");
				if (WPCtrl.MayIProcess(ctrl)) {
					ctrl.preProcess();
					WPCtrl.DoProcessLastTriedOra = true; } }
			else {
				var ctrl = WP.GetInstance("CaseManWPCtrl");
				if (WPCtrl.MayIProcess(ctrl)) {
					ctrl.preProcess();
					WPCtrl.DoProcessLastTriedOra = false; } } } }
	catch (err) {
		var str = "WPCtrl.DoProcess caught exception from WPCtrl.Instance.preProcess()";
		if (doLog) do_Log(str, err); } */	
	WPCtrl.TriggerProcess(); }


/**
 * SUPS Word Processing Controller function, called by the WPCtrl internals, 
 * part of the process that polls the request queue for processing to do.
 * This function ensures that no to subclasses of me will be processing at the same time...
 * Do not override
 */
WPCtrl.MayIProcess = function(wpctrl) {
	if (doLog) do_Log("WPCtrl.MayIProcess("+wpctrl.toString()+")");
	var mayI = false;
	if (null == WPCtrl.CtrlRunningProcess) {
		WPCtrl.CtrlRunningProcess = wpctrl;
		mayI = true; }
	else {
		if (WPCtrl.CtrlRunningProcess == wpctrl) {
			return true; } }
	if (doLog) do_Log("WPCtrl.MayIProcess("+wpctrl.toString()+") returns " + mayI);
	return mayI; }

/**
 *
 */
WPCtrl.CtrlRunningProcess = null;

/**
 *
 */
WPCtrl.EndRunningProcess = function(wpctrl) {
	if (doLog) do_Log("WPCtrl.EndRunningProcess("+wpctrl.toString()+")");
	if (WPCtrl.CtrlRunningProcess == wpctrl) {
		WPCtrl.CtrlRunningProcess = null;
		if (doLog) do_Log("WPCtrl.EndRunningProcess("+wpctrl.toString()+") : WPCtrl.CtrlRunningProcess = null;"); }
	else {
		if (doLog) do_Log("WPCtrl.EndRunningProcess("+wpctrl.toString()+") :  != WPCtrl.CtrlRunningProcess !!!!!");
		//alert("Controller " + wpctrl.toString() + " can not end the running processing controller, as it's not 'him'");
	} }

/**
 * SUPS Word Processing Controller function, called by the WPCtrl internals, 
 * part of the process that polls the request queue for processing to do.
 * This function invokes the xxx's doprocess() function.
 * Do not override
 */	
WPCtrl.prototype.preProcess = function() {
/**	try { 	**/
		if (doLog) do_Log(this.toString() + ".prototype.preProcess ");		
		var pro = this.processQ.pop();		
		if (null != pro) 
		{
		/** if (doLog) do_Log("WPCtrl.prototype.preProcess pro = " +pro); **/
			var okToRunProcess = true;
			if(pro.length && pro.pop) {
				/** if array request, then there is a condition to be matched before this request can be processed **/
				var con = pro[0]; /** condition **/
				if (doLog) do_Log(this+" preProcess() pro con = " +con);			
				var rrq = pro[1]; /** real request **/
				if (doLog) do_Log(this+" preProcess() pro pro = " +rrq);
				okToRunProcess = ((null == con) ? true : con.apply(null, [rrq]));
				if (doLog) do_Log(this+" preProcess() condition check " + okToRunProcess + " for " + rrq); 
				if (okToRunProcess)	{
					rrq.doprocess(this); }
			 	else { 
			 		this.processQ.push(pro); 
			 		WPCtrl.EndRunningProcess(this); } }
			else {
				pro.doprocess(this); } } 
		else {
	 		WPCtrl.EndRunningProcess(this); }
/**	 }
	catch (err) {
		var str = this+".preProcess caught exception, throwing it up";
		if (doLog) do_Log(str, err);
		throw(err); }   **/
}

/**
 * SUPS Word Processing Controller function, called by the WPCtrl internals,
 * part of the processing - adding a process/request to process to the Q.
 * Do not override
 */
//WPCtrl.prototype.addRequest = function(request) {
//	this.processQ.unshift(request);
//}

/**
 * Word Processing Controller toString function override the JavaScript Object's toString.
 * SUPS Application-specific subclasses should implement & override this function.
 * Please override this function
 */
WPCtrl.prototype.toString = function() {
	return "SUPS Word Processing Controller Instance"; }

/**
 * SUPS Word Processing Controller static function
 * recording a state (value) on a key xphat for an output.
 * Do not override
 * @argument WPProcess process
 * @arugment String key - xpath relative to WPCtrl root
 * @argument value - Object value for that key
 * @returns void
 */
WPCtrl.SetState = function(process, key, value) {
	var stateId = process.getOutputStateId(key)
	WPCtrl.State[stateId] = value;
	if (doLog) do_Log("WPCtrl.SetState("+process+", "+key+", "+value+") ["+stateId+"]"); }

/**
 * SUPS Word Processing Controller static function
 * returning the state (value) (if any) on a key xphat for an output.
 * Do not override
 * @type Object
 * @argument WPProcess process
 * @arugment String key - xpath relative to WPCtrl root
 * @returns null || Object
 */
WPCtrl.GetState = function(process, key) {
	if ((null == process) || (null == key)) return "";
	var stateId = process.getOutputStateId(key);
	var stateValue = WPCtrl.State[stateId];
	if (doLog) do_Log("WPCtrl.GetState("+process+", "+key+") = " + stateValue);
	return stateValue; }

/**
 * SUPS Word Processing Controller static function
 * returning the state (value) (if any) on a key xphat for an output.
 * Do not override
 * @type Object
 * @argument WPProcess process
 * @arugment String key - xpath relative to WPCtrl root
 * @returns null || Object
 */
WPCtrl.CheckState = function(stateId, value) {
	var stateValue = WPCtrl.State[stateId];
	if (doLog) do_Log("WPCtrl.CheckState("+stateId+", "+value+") = " + (stateValue == value));
	return stateValue == value; }

/**
 * SUPS Word Processing Controller static function
 * clearing all state (all values) for an output. 
 * Do not override
 * @returns void
 * @argument WPProcess process
 */
WPCtrl.ClearState = function(process) {
	var output = process.getOutput();
	WPState.RemoveAllState(output); }

/**
 * SUPS Word Processing Controller static function
 * clearing a specific state, as specified by the stateKey
 * Do not override
 * @returns void
 * @argument String state key
 */
WPCtrl.ClearStateKey = function(stateKey) {
	WPCtrl.State[stateKey] = null; }
	
/**
 * SUPS Word Processing Controller Process function
 * <pre>Invoked by the WPCtrl (delegating the WP.Process(...) call.
 * Subclasses MAY override this function - provided this implementation is also used.</pre>
 * @argument formController		formController managing the 'current' form requesting the word processing
 * @argument context			xml fragment stating the context for the request
 * @argument callback			callback (function or formname)
 * @argument allwaysCallback 	indicator whether or not to always call the callback, or only after the controller made the appliction navigate away from the 'current' form.
 */
WPCtrl.prototype.process = function(WPS, formctrl, context, callback, alwaysCallback) {
	 var str = "SUPS Application specific controllers must implement the .prototype.process function";
	 do_X(str); }	 	

/**
 * SUPS Word Processing Controller Process function ...
 * Subclasses MUST NOT override this function.
 *
 * @type WPProcess
 * @argument formController		formController managing the 'current' form requesting the word processing
 * @argument context			xml fragment stating the context for the request
 * @argument callback			callback (function or formname)
 * @argument allwaysCallback 	indicator whether or not to always call the callback, or only after the controller made the appliction navigate away from the 'current' form.
 * @returnw WPProcess
 * @deprecated -- see processFindRequests
 */
WPCtrl.prototype.processFindRequest = function(formctrl, context, callback, alwaysCallback) {
	var process = this.identifyProcess(formctrl, context); 
	if (null != process) {
		process.setCallback(callback);
		process.setAlwaysCallback(alwaysCallback); }
	return process; }

/**
 * SUPS Word Processing Controller Process function ...
 * Subclasses MUST NOT override this function.
 *
 * @type WPProcess
 * @argument formController		formController managing the 'current' form requesting the word processing
 * @argument context			xml fragment stating the context for the request
 * @argument callback			callback (function or formname)
 * @argument allwaysCallback 	indicator whether or not to always call the callback, or only after the controller made the appliction navigate away from the 'current' form.
 * @returnw WPProcess
 */
WPCtrl.prototype.processFindRequests = function(formctrl, context, callback, alwaysCallback) {
	var msg = "WPCtrl.prototype.processFindRequests ";
	var processes = this.identifyProcesses(formctrl, context); 
	var noOfPro = processes.length;
	if (noOfPro > 0) {
		var lastPro = noOfPro - 1;
		var lastProcess = processes[lastPro];
		lastProcess.setCallback(callback);
		lastProcess.setAlwaysCallback(alwaysCallback); }
	else {
		if (doLog) do_Log(msg + "no process identified for context given, must redirect:" + alwaysCallback);
		var nothingElseToDo = true;
		/** checking our Q lenght, if there is a request on, ignore redirect **/
		nothingElseToDo = (0 == WPCtrl.ProcessQ.length) && true;
		if (doLog && nothingElseToDo) do_Log(msg + " processes found in the Queue - not redirecting now.");
		if (true == alwaysCallback && true == nothingElseToDo) {
			WPS.NavigateTo(callback); }	
	} 
	return processes; }

/**
 * SUPS Word Processing Controller identifyRequest function analyzing the contextxml and
 * returning the appropriate request to run or null;
 * Subclasses MUST override this function!
 
 * @type WPRequest
 * @argument formctrl			formcontroller of invoking screen
 * @argument context			xml fragment stating the context for the request
 * @returns WPProcess
 * @deprecated - see identifyProcesses()
 */
WPCtrl.prototype.identifyProcess = function(formctrl, context) {
	 var str = "SUPS Application specific controllers must implement the .identifyProcess function";
	 do_X(str); }

/**
 * SUPS Word Processing Controller identifyProcesses function analyzing the contextxml and
 * returning the appropriate request to run or null;
 * Subclasses MUST override this function!
 
 * @type WPRequest
 * @argument formctrl			formcontroller of invoking screen
 * @argument context			xml fragment stating the context for the request
 * @returns WPProcess
 */
WPCtrl.prototype.identifyProcesses = function(formctrl, context) {
	 var str = "SUPS Application specific controllers must implement the .identifyProcesses function";
	 do_X(str); }

/**
 * SUPS Word Processing Controller getEmptyContextDOM function return an context xml DOM to be completed,
 * and submitted in the WP.Process() API.
 * This method is abstract, subclasses must implement it. "NEW_contextXML", "CaseManWPXPath"
 * @type Document
 * @returns empty context DOM
 */
WPCtrl.prototype.getEmptyContextDOM = function()  {
	var str = "SUPS Application specific controllers must implement the .getEmptyContextDOM function";
	do_X(str); }
	
/**
 *
 * @returns the host serving the SUPS Word Processing Controller
 */
WPCtrl.prototype.getHost = function() {
	return window.location.host; }
	
/**
 * SUPS Word Procesing Controller function doing an intial/quick parse of the configuration, including
 * -setting up xpahts.
 * Do not override
 * @argument xpathClass
 * @returns boolean indicating success
 */
WPCtrl.prototype.initializeXPaths = function(xpathClass) {	
	var ctrl = this;
	var success = eval(xpathClass+".Initialize(ctrl)");
	ctrl = null;
	return success; }

/**
 * SUPS Word Procesing Controller function doing an intial/quick parse of the configuration, including
 * -setting up xpahts.
 * Do not override
 * @argument processClass
 * @returns boolean indicating success
 */
WPCtrl.prototype.initializeProcess = function(processClass) {	
	var ctrl = this;
	var success = eval(processClass+".Initialize(ctrl)");
	ctrl = null;
	return success; }

/**
 * SUPS Word Processing Controller function adding a WPProcess (subclass) instance in the array of process definitions
 * Do not override
 * @argument process
 */
WPCtrl.prototype.addProcess = function(process) {
	this.processDefs.push(process); }

/**
 * SUPS Word Processing Controller function updating a WPProcess (subclass) instance in the array of process definitions
 * Do not override
 * @argument process
 */
WPCtrl.prototype.updateProcess = function(process) {
	var i = this.processDefs.length;
	var j = 0;
	while ( j < i ) {
		aPro = this.processDefs[j];
		if (aPro.getName() == process.getName()) {
			this.processDefs[j] = process;
			j = i + 1; }
		j++; } }

/**
 * SUPS Word Processing Controller function adding a WPProcess (subclass) instance in the array of running processes
 * Do not override
 * @argument process
 * @argument last	optional boolean indicating whether or not to add to the end of the q (rather than the beginning)
 */
WPCtrl.prototype.addProcessToQ = function(process, last) {
	var arr = process;
	if (!arr.pop) {
		arr = [null, process, this]; }
	else {
		arr[2] = this; }	
	if (true == last) {
		if (doLog) do_Log("WPCtrl.prototype.addProcessToQ adding to the end: " + arr);
/**		this.processQ.push(process);  **/
		WPCtrl.ProcessQ.push(arr); }
	else {
		if (doLog) do_Log("WPCtrl.prototype.addProcessToQ adding to the front: " + arr);
/**		this.processQ.unshift(process); **/
		WPCtrl.ProcessQ.unshift(arr); } }

/**
 * SUPS Word Processing Controller function returning the WPProcess definitions
 * Do not override
 * @type Array
 * @returns array containing process definitions
 */
WPCtrl.prototype.getProcesses = function() {
	return this.processDefs; }

/**
 *
 */
WPCtrl.prototype.getApplicationController = function() {
	return this.appCtrl; }	

/**
 * SUPS Word Procesing Controller function returning the url pointing at SUPS Application 
 * instance using this word processing controller instance.
 * Subclasses MUST override this function!
 * e.g. http://casemanft01:8080/caseman-client
 * @returns String representation of the url hosting the SUPS Client application of which the controller forms part
 */
WPCtrl.prototype.getClientAppUrl = function() {
	var str = "SUPS Application specific controllers must implement the .prototype.getClientAppUrl function";
	do_X(str);  }

/**
 * SUPS Word Procesing Controller function returning the url pointing at WPController's configuration xml
 * Subclasses MUST override this function!
 * e.g. http://casemanft01:8080/caseman-client/xxxx/wpctrl.xml
 * @returns String representation of the url hosting the application WPController's configuration xml
 */
WPCtrl.prototype.getControllerConfigXMLUrl = function() {
	var str = "SUPS Application specific controllers must implement the .prototype.getControllerConfigXMLUrl function";
	do_X(str);  }

/**
 * SUPS Word Procesing Controller function returning the url pointing at SUPS Application 
 * instance using this word processing controller instance.
 * Subclasses MUST override this function!
 * e.g. http://casemanft01:8080/caseman-server
 * @returns String representation of the url hosting the SUPS Server application of which the controller forms part
 */
WPCtrl.prototype.getServerAppUrl = function() {
	var str = "SUPS Application specific controllers must implement the .prototype.getServerAppUrl function";
	do_X(str); }

/**
 * SUPS Word Procesing Controller function returning the xpath pointing in the DOM at the Word Processing data.
 * Subclasses MUST override this function!
 * @returns String represenation of the xpath pointing at WP data in the application's DOM.
 */
WPCtrl.prototype.getBaseXPath = function() {
	var str = "SUPS Application specific controllers must implement the .prototype.getBaseXPath function";
	do_X(str); }

/**
 * SUPS Word Procesing Controller function returning the process responsible for the current application screen loaded
 * Do not override
 * @type WPProcess
 * @returns WPProcess processOnScreen 
 */
WPCtrl.prototype.getScreenProcess = function() {
	return this.processOnScreen; }

/**
 * SUPS Word Procesing Controller function setting the process responsible for the current application screen loaded
 * Do not override
 * @type WPProcess
 * @argument WPProcess process
 */
WPCtrl.prototype.setScreenProcess = function(process) {
	this.processOnScreen = process; }

/**
 * SUPS Word Processing Controller private function, in use by the WP API,
 * delegating to the abstract PreviewOutputInEditor function. (see for more info)
 */
WPCtrl.prototype._PreviewOutputInEditor = function() {
	return this.PreviewOutputInEditor() ; }

/**
 * SUPS Word Processing Controller abstract function.
 * Application specific subcontroller must implement this function
 */
WPCtrl.prototype.PreviewOutputInEditor = function() {
	var str = "SUPS Application specific controllers must implement the .prototype.PreviewOutputInEditor function";
	do_X(str); }

/**
 * SUPS Word Processing Controller private function, in use by the WP API,
 * delegating to the abstract PrintOutputInEditor function. (see for more info)
 */
WPCtrl.prototype._PrintOutputInEditor = function() {
	return this.PrintOutputInEditor() ; }

/**
 * SUPS Word Processing Controller abstract function.
 * Application specific subcontroller must implement this function
 */
WPCtrl.prototype.PrintOutputInEditor = function() {
	var str = "SUPS Application specific controllers must implement the .prototype.PrintOutputInEditor function";
	do_X(str); }

/**
 * SUPS Word Processing Controller private function, in use by the WP API,
 * delegating to the abstract PrintOutputInEditor function. (see for more info)
 */
WPCtrl.prototype._CheckForMoreEvents = function(frmCtrl, dom, wpDom, nextScreen, alwaysCallback) {
	return this.CheckForMoreEvents(frmCtrl, dom, wpDom, nextScreen, alwaysCallback) ; }

/**
 * SUPS Word Processing Controller abstract function.
 * Application specific subcontroller must implement this function
 */
WPCtrl.prototype.CheckForMoreEvents = function(frmCtrl, dom, wpDom, nextScreen, alwaysCallback) {
	var str = "SUPS Application specific controllers must implement the .prototype.CheckForMoreEvents function";
	do_X(str); }

/**
 * SUPS Word Procesing Controller function setting the (Case/CO) Number for the QA Screen header
 * Do not override
 * @argument headerNumber
 */
WPCtrl.SetQA_HeaderNumber = function(headerNumber, wpprocess) {
	WPCtrl.SetState(wpprocess, WPState.QA_HeaderNumber, headerNumber); }		
				
/**
 * SUPS Word Procesing Controller function setting the (Case/CO) Parties for the QA Screen header
 * Do not override
 * @argument headerParties
 */
WPCtrl.SetQA_HeaderParties = function(headerParties, wpprocess) {
	WPCtrl.SetState(wpprocess, WPState.QA_HeaderParties, headerParties); }		
			
/**
 * SUPS Word Procesing Controller function setting the type of QA Screen (Case or CO)
 * Do not override
 * @argument screenType ('Case' or 'CO'
 */
WPCtrl.SetQA_ScreenType = function(screenType, wpprocess) {
	WPCtrl.SetState(wpprocess, WPState.QA_ScreenType, screenType); }

/**
 * SUPS Word Procesing Controller function setting the (Case/CO) Number for the QA Screen header
 * Do not override
 * @argument wpprocess
 */
WPCtrl.GetQA_HeaderNumber = function(wpprocess) {
	return WPCtrl.GetState(wpprocess, WPState.QA_HeaderNumber); }		
				
/**
 * SUPS Word Procesing Controller function setting the (Case/CO) Parties for the QA Screen header
 * Do not override
 * @argument wpprocess
 */
WPCtrl.GetQA_HeaderParties = function(wpprocess) {
	return WPCtrl.GetState(wpprocess, WPState.QA_HeaderParties); }		
			
/**
 * SUPS Word Procesing Controller function setting the type of QA Screen (Case or CO)
 * Do not override
 * @argument wpprocess 
 */
WPCtrl.GetQA_ScreenType = function(wpprocess) {
	return WPCtrl.GetState(wpprocess, WPState.QA_ScreenType); }
