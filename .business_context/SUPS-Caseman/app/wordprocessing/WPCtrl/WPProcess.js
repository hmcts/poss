/**
 * SUPS Word Processing Process JavaScript Class.
 * <pre>A SUPS Word Processing process is defined by their name and 
 * the process steps it is composed of, both listed in the wpctrl.xml 
 * configuration. (see the wpctrl.xsd)
 *
 * </pre>
 * @constructor
 */
function WPProcess(name) {
	/**
	 * Name of this process
	 */
	this.name = name;
	/**
	 * Steps of this process
	 */
	this.steps = new Array();
	/**
	 * Index of Last step executed
	 */
	this.lastStep = 0;
	/**
	 * Filters to be matched for this process to be run
	 */
	this.filters = new Array();
	/**
	 * Reference to the request handled by this process
	 */
	this.request = null;
	/** 
	 * Reference to the output handled by this process
	 */
	this.output = null;
	/**
	 * Attribute containing the callback - if any
	 * Set as part of the process creation - passed in via the API call
	 */
	this.callback = null;
	/**
	 * Attribute indicating the callback must allways be invoked upon wp processing. If not specified, wp only executes callback if a QA and or WP screen was loaded.
	 * Set as part of the process creation - passed in via the API call
	 */
	this.alwaysCallback = null;
}

/**
 *
 */
WPProcess.prototype.getDefaultPrinter = function() {
	return "";
}

/**
 *
 */
WPProcess.prototype.setCallback = function(callback) {
	this.callback = callback;
}

/**
 *
 */
WPProcess.prototype.getCallback = function() {
	return this.callback;
}

/**
 *
 */
WPProcess.prototype.setAlwaysCallback = function(awcb) {
	this.alwaysCallback = awcb;
}	

/**
 *
 */
WPProcess.prototype.getAlwaysCallback = function() {
	return this.alwaysCallback;
}

/** 
 *
 */
WPProcess.prototype.clone = function(){
	if(typeof(this) != "object"){
		return this;
	}
	var cloneDepth = ((arguments.length >= 1)?((isNaN(parseInt(arguments[0])))?(null):parseInt(arguments[0])):null);
	if (cloneDepth){
		cloneDepth=((cloneDepth <= 0)?(null):(cloneDepth));
	}
	var cloneObject = null;
	var thisConstructor = this.constructor;
	var thisConstructorPrototype = thisConstructor.prototype;
	if (thisConstructor == Array){
		cloneObject = new Array();
	} else if(thisConstructor == Object){
		cloneObject = new Object();
	} else {
		try{
			cloneObject = new thisConstructor;
		} catch(exception) {
			cloneObject = new Object();
			cloneObject.constructor = thisConstructor;
			cloneObject.prototype = thisConstructorPrototype;
		}
	}
	var propertyName = "";
	var newObject=null;
	for (propertyName in this){
		newObject = this[propertyName];
		//if (!thisConstructorPrototype[propertyName])
		//{
			if (typeof(newObject)=="object")
			{
				if (newObject === null)
				{
					cloneObject[propertyName] = null;
				} 
				else 
				{
					if(cloneDepth)
					{
						if(cloneDepth == 1)
						{
							cloneObject[propertyName] = null;
						} 
						else 
						{	
							if (0 <= newObject.length )
							{
								var x = new Array();
								var y = newObject.length;
								for (var i = 0; i < y; i++)
								{
									x[i] = newObject[i];
								}
								cloneObject[propertyName] = x;
							}
							else
							{
								alert("typeof(newObject) = " + typeof(newObject));
								cloneObject[propertyName] = newObject.clone(--cloneDepth);
							}
						}
					} 
					else 
					{
						if (0 <= newObject.length )
						{
							var x = new Array();
							var y = newObject.length;
							for (var i = 0; i < y; i++)
							{
								x[i] = newObject[i];
							}
							cloneObject[propertyName] = x;
						}
						else
						{					
							if (newObject && newObject.clone)
							{
								cloneObject[propertyName] = newObject.clone();
							}
							else
							{
								cloneObject[propertyName] = newObject;
							}
						}
					}
				}
			} 
			else 
			{
				cloneObject[propertyName] = newObject;
			}
		//}
	}
	return cloneObject;
}

/**
 * SUPS Word Processing Process 
 *
 * @type String
 * @returns string representation of this WPProcess
 */
WPProcess.prototype.toString = function() {
	return "SUPS WPProcess " + this.name;
}

/**
 * SUPS Word Processing Process 
 * <pre>ABSTRACT FUNCTION Application specific subclass must implement this function,
 * and return a WPRequest instance. One can/should use the context and or process
 * to determine which request to return.</pre>
 * @type WPRequest
 * @returns wprequest 
 */
WPProcess.prototype.determineRequest  = function(context, process) {
	do_X("WPProcess subclasses must implement the .prototype.determineRequest function!");
}

/**
 * SUPS Word Processing Process 
 * <pre>ABSTRACT FUNCTION Application specific subclass must implement this function,
 * and return a WPOutput instance. One can/should use the context and or process
 * to determine which output to return.</pre>
 * @type WPOuput
 * @returns wpoutput
 */
WPProcess.prototype.determineOutput = function(context, process) {
	do_X("WPProcess subclasses must implement the .prototype.determineOutput function!");
}

/**
 * SUPS Word Processing Process 
 * <pre>ABSTRACT FUNCTION Application specific subclass must implement this function,
 * and return a WPOutput instance. One can/should use the context and or process
 * to determine which outputs to return.</pre>
 * @type Array of WPOuput
 * @returns Array of WPOutput
 */
WPProcess.prototype.determineOutputs = function(context, process) {
	do_X("WPProcess subclasses must implement the .prototype.determineOutputs function!");
}



/**
 * SUPS Word Processing Process - get the request of this proces
 * @type WPRequest
 * @returns wprequest
 */
WPProcess.prototype.getRequest = function() {
	return this.request;
}

/**
 * SUPS Word Processing Process - set the request of this process 
 * @argument WPRequest request
 */
WPProcess.prototype.setRequest = function(request) {
	this.request = request;
}

/** 
 * SUPS Word Processing Process - get the output of this process
 * @type WPOutput
 * @returns the output for which this process runs
 */
WPProcess.prototype.getOutput = function() {
	return this.output;
}

/**
 * SUPS Word Processing Process - get the output state id to use in 
 * WPCtrl SetState.
 * @argument partOfId the key which we want to use to record sate.
 * @returns String the output's state id for the key specified
 */
WPProcess.prototype.getOutputStateId = function(partOfId) {
	return this.getOutput().getStateId(partOfId);
}

/** 
 * SUPS Word Processing Process - set the output of this process
 * @argument output WPOutput
 */
WPProcess.prototype.setOutput = function(output) {
	this.output = output;
}

/**
 * SUPS Word Processing Process - get the name of this process
 * @returns String the name of this process
 */
WPProcess.prototype.getName = function() {
	return this.name;
}

/**
 * SUPS Word Processing Process - get the process steps in the proces
 *
 * @type array
 * @returns array of steps
 */
WPProcess.prototype.getSteps = function() { 
	return this.steps;
}

/**
 * SUPS Word Processing Process - add a process step to this process
 *
 * @argument step string indicating step name.
 */
WPProcess.prototype.addStep = function(klass, step) {
	try
	{
		var str = "new " +klass + "Step__"+step+"()";
		this.steps.push(eval(str));
	}
	catch(e)
	{
		if (doLog) do_Log("Exception in WPProcess.prototype.addStep("+klass+","+step+") : " + e);		
	}
}

/**
 * SUPS Word Processing Process - get the filters that identify this process in the contextxml
 *
 * @type Array
 * @returns array of filters
 */
WPProcess.prototype.getFilters = function() { 
	return this.filters;
}

/**
 * SUPS Word Processing Process - add a filter identifying this process in the contextxml
 *
 * @argument step string indicating step name.
 */
WPProcess.prototype.addFilter = function(xpath, value) {
	this.filters.push([xpath, value]);
}


/**
 * SUPS Word Processing Process 
 * Parses the processes from the wpctrl configuration xml as part of initialisation
 * @argument wpctrl
 * @argument klass
 */
WPProcess.ParseConfigurationProcesses = function(wpctrl, klass) {
	try {
		var configxml = wpctrl.getConfigXML();
		var processes = configxml.selectNodes("/configuration/processes/process");
		var proLen = processes.length;
		for (var i=0; i<proLen; i++) {
			var processNode = processes[i];
			var nameNode = processNode.selectSingleNode("name");
			var nameValue = null != nameNode ? WPS.getNodeTextContent(nameNode) : "[no nameNode found]";
			var _newProcess = null;
			var createProcessStr = "_newProcess = new "+klass+"('"+nameValue+"')";
			eval(createProcessStr);
			var steps = processNode.selectNodes("steps/step");
			var stpLen = steps.length;
			for (var j=0; j < stpLen; j++) {
				var stepNode = steps[j];
				var stepValue = WPS.getNodeTextContent(stepNode);
				_newProcess.addStep(klass, stepValue); }
			wpctrl.addProcess(_newProcess);	} }
	catch(err) {
		var str = this.toString + " WPProcess.ParseConfiguration caught exception";
		if (doLog) do_Log(str, err);
		return false; }
	return true; }
	
/**
 * SUPS Word Processing Process 
 * Parses the process triggers/filters from the wpctrl configuration xml as part of initialisation
 * @argument wpctrl
 */
WPProcess.ParseConfigurationProcessTriggers = function(wpctrl) {
	try {
		var processes = wpctrl.getProcesses();
		var processesL = processes.length;
		var configxml = wpctrl.getConfigXML();
		var triggers = configxml.selectNodes("/configuration/triggers/trigger");
		var triLen = triggers.length;
		for (var i=0; i<triLen; i++) {
			var triggerNode = triggers[i];
			var processNode = triggerNode.selectSingleNode("process");
			if (null == processNode) throw new Error("fcasdfs")
			var processValue = null != processNode ? WPS.getNodeTextContent(processNode) : "[no processNode found]";
			var process = null;
			for (var k=0; k < processesL && (null == process); k++) {
				var aPro = processes[k];
				if (aPro.getName() == processValue) {
					process = aPro; } }									//.clone()
			if (null != process) {			
				var filters = triggerNode.selectNodes("filter");
				var filLen = filters.length;
				for (var j=0; j < filLen; j++) {
					var filNode = filters[j];
					var xpathNode = filNode.selectSingleNode("xpath");
					var xpathValue = null != xpathNode ? WPS.getNodeTextContent(xpathNode) : "[no xpathNode found]";				
					var xpathValueNode = filNode.selectSingleNode("value");
					var xpathValueValue = "";
					if (null != xpathValueNode) {
						xpathValueValue = null != xpathNode ? WPS.getNodeTextContent(xpathValueNode) : "[no valueNode found]"; }										
					var xpathObj = WPXPath.getPath(xpathValue)
					process.addFilter(xpathObj, xpathValueValue); }
				wpctrl.updateProcess(process); }
			else {
				do_D("error - process trigger found for undefined process\n\n"+ processValue);
				do_Log("error - process trigger found for undefined process\n\n"+ processValue); } } }
	catch(err) {
		var str = this.toString + " WPProcess.ParseConfiguration caught exception";
		if (doLog) do_Log(str, err);
		return false; }
	return true; }

/**
 * SUPS Word Processing Process - identifies the (if one) process to execute for the contextxml 
 *
 * @argument wpctrl
 * @argument contextxml
 * @argument cb callback
 * @argument acb always callback
 * @type WPProcess
 * @returns WPProcess (subclass) instance matching the contextxml
 * @deprecated see FindProcessesFor()
 */
WPProcess.FindProcessFor = function(wpctrl, contextxml, cb, acb) {

	var process = null;
	var defs = wpctrl.getProcesses();
	var defLen = defs.length;
	var i = 0;
	while ((null == process) && (i < defLen)) {
		var aPro = defs[i];
		var xPaths = aPro.getFilters();
		var xPLen = xPaths.length;
		var noInvalidPaths = true;
		var j =0;
		while (noInvalidPaths && (j < xPLen)) {
			var xPV = xPaths[j];
			var xV = xPV[1]; // the expected value
			var xP = xPV[0]; // the xpath on which to expect 
			var path = xP.getPath();
			var pathNode = contextxml.selectSingleNode(path);
			if (null != pathNode) {
				var pathValue = WPS.getNodeTextContent(pathNode)
				if (xV != "") {
					if (xV != pathValue) {
						noInvalidPaths = false; } } }
			j++; }
		if (noInvalidPaths) {
			process = aPro.clone(); }
		i++; }
	if (null != process) {
		process.setCallback(cb);
		process.setAlwaysCallback(acb);
		process.setRequest(process.determineRequest(contextxml, process));
		process.setOutput(process.determineOutput(contextxml, process, wpctrl)); }
	else {
		if (doLog) do_Log("WPProcess.FindProcessFor() retyurns null process!!");
	}
	return process; }
	
	
	/**
 * SUPS Word Processing Process - identifies the (if one) process to execute for the contextxml 
 *
 * @argument wpctrl
 * @argument contextxml
 * @argument cb callback
 * @argument acb always callback
 * @type WPProcess
 * @returns WPProcess (subclass) instance matching the contextxml
 */
WPProcess.FindProcessesFor = function(wpctrl, contextxml, cb, acb) {

	var processes = new Array;
	var process = null;
	var defs = wpctrl.getProcesses();
	var defLen = defs.length;
	var i = 0;
	while ((null == process) && (i < defLen)) {
		var aPro = defs[i];
		var xPaths = aPro.getFilters();
		var xPLen = xPaths.length;
		var noInvalidPaths = true;
		var j =0;
		while (noInvalidPaths && (j < xPLen)) {
			var xPV = xPaths[j];
			var xV = xPV[1]; // the expected value
			var xP = xPV[0]; // the xpath on which to expect 
			var path = xP.getPath();
			var pathNode = contextxml.selectSingleNode(path);
			if (null != pathNode) {
				var pathValue = WPS.getNodeTextContent(pathNode);
				if (xV != "") {
					if (xV != pathValue) {
						noInvalidPaths = false; } } }
			j++; }
		if (noInvalidPaths) {
			process = aPro.clone(); }
		i++; 
	}
	if (null != process) 
	{
		//process.setCallback(cb);
		//process.setAlwaysCallback(acb);
		
		process.setRequest(process.determineRequest(contextxml, process));
		
		var outputs = process.determineOutputs(contextxml, process, wpctrl);
		
		var NoOfOutputs = outputs.length;
		for (var i=0; i < NoOfOutputs; i++)
		{
			var aPro = process.clone();
			
			var oput = outputs[i];
			var alt = oput.getAltProcess();
			
			if( null != alt )
			{ 	
				var defs = wpctrl.getProcesses();
				for( var i =0; i < defs.length; i++)
				{	
					if( defs[i].getName() == alt )  //found alt process
					{	aPro = defs[i].clone();
						aPro.setRequest( aPro.determineRequest(contextxml, aPro ));						
					}
				}	
			}
					
			aPro.setOutput(oput);
			processes.push(aPro);
		}								
	}
	else 
	{
		if (doLog) do_Log("WPProcess.FindProcessFor() returns null process!!");
	}	
	return processes; }
	
	
/**
 * SUPS Word Processing Process - progresses the process through its' steps.
 * @returns void
 */
WPProcess.prototype.doprocess = function(wpctrl) {
	if (doLog) do_Log(this +" doprocess() - last : " + this.lastStep + " : all : " + this.steps.length)
	if (this.lastStep < this.steps.length) {
		this.lastStep++;
		var step = this.steps[this.lastStep-1]
		var condition = step.process(wpctrl, this)
		var doneOrCondition = this.isDone(wpctrl, step, condition);
		if (null != doneOrCondition) {
			if (true == doneOrCondition) {
			 // done
			 WPCtrl.EndRunningProcess(wptrl);
			}
			else if (null == doneOrCondition) {
				// requeue process, no condition to be matched before continueing this process
				// wpctrl.processQ.push([null,this, wpctrl]);
				wpctrl.addProcessToQ([new Function("return true"),this, wpctrl], false);
			}
			else {
				// requeue process, condition to be matched before continueing this process
				// wpctrl.processQ.push([condition, this, wpctrl]);		
				wpctrl.addProcessToQ([condition,this, wpctrl], false);
			}			
		}
	}
}

/**
 * SUPS Word Processing Process - indicates whether or not the process run has completed
 * @returns boolean indicating whether or not the process run has completed
 *
 */
WPProcess.prototype.isDone = function(wpctrl, wpstep, condition) {
	var done = this.lastStep == this.steps.length
	if (done) {
		done = (null == condition); }
	return done; }


/**
 * SUPS Word Processing Process Step class
 * @constructor
 */
function WPProcessStep(name) {
	WPProcess.apply(this, [name]);
	/**
	 * Reference to the process instance in which this step is exectured
	 */
	this.runningprocess = null;
}

/**
 * SUPS Word Processing Process Step super class
 */
WPProcessStep.prototype = new WPProcess();

/**
 * SUPS Word Processing Process Step reference to constructor
 */
WPProcessStep.prototype.constructor = WPProcessStep;

/**
 * SUPS Word Processing Process Step toString 
 * @type String
 * @returns string representation of this WPProcess
 */
WPProcessStep.prototype.toString = function() {
	return "WPProcessStep " + this.name;
}


/**
 * SUPS Word Processing Process Step - sets the 'owning' process of this step
 * @type void
 * @argument process
 * @returns -
 */
WPProcessStep.prototype.setProcess = function(process) {
	this.runningprocess = process; }

/**
 * SUPS Word Processing Process Step - returns the 'owning' process of this step 
 * @type WPProcess 
 * @returns WPProcess instance in which this step is to execute
 */
WPProcessStep.prototype.getProcess = function() {
	return this.runningprocess; }

/**
 * SUPS Word Processing Process Step preprocess function 
 * This function MUST BE INVOKED BY EACH WPProcessStep subclass' process function
 */
WPProcessStep.prototype.preprocess = function(wpctrl, wpprocess) {
	if (doLog) do_Log(this + " .preprocess()");
	this.setProcess(wpprocess);
}

/**
 * SUPS Word Processing Process Step
 * Abstract function - subclasses MUST implement this function
 *
 * @argument wpctrl
 * @argument wpprocess
 */
WPProcessStep.prototype.process = function(wpctrl, wpprocess) {
	do_X("WPProcessStep subclasses must implement the .prototype.process() method");
}

/**
 * SUPS WOrd Processing Process Step getConfitionFunction
 * This function returns null or a function which returns a boolean indicating
 * whether it's ok to proceed with the next process step.
 * @type Function
 * @retuns function
 */
WPProcessStep.prototype.getConditionFunction = function() {
	do_X("WPProcessStep subclasses must implement the .prototype.getConditionFunction() method");
}

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
function WPProcessStep__LoadData() {
	WPProcessStep.apply("LoadData")
}

/**
 *
 */
WPProcessStep__LoadData.prototype = new WPProcessStep();

/**
 *
 */
WPProcessStep__LoadData.prototype.constructor = WPProcessStep__LoadData;

/**
 * WPOutput.__LoadData web service success handler
 */
WPProcessStep__LoadData.prototype.onSuccess = function(dom, serviceName) {
	if ( null != dom ) {
		Services.setTransientStatusBarMessage("");
		Services.setValue(CHANGES_MADE_XPATH, "N"); } }

/**
 * WPProcessStep__LoadData web service business expcetion handler
 */
WPProcessStep__LoadData.prototype.onBusinessException = function(exception) {
	if(exception.name == "UpdateLockedException") {
		if(confirm(Messages.WRITE_WRITE_CONFLICT_MSG)) {
			// Reload all data 
		}
		else {
			exitScreen(); } } 
	else {
		alert(Messages.FAILEDSAVE_MESSAGE);
		exitScreen(); } }

/**
 * WPProcessStep__LoadData web service system expcetion handler
 */
WPProcessStep__LoadData.prototype.onSystemException = function(exception)  {
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen(); }




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
function WPProcessStep__ReLoadData() {
	WPProcessStep.apply("ReLoadData")
}

/**
 *
 */
WPProcessStep__ReLoadData.prototype = new WPProcessStep();

/**
 *
 */
WPProcessStep__ReLoadData.prototype.constructor = WPProcessStep__ReLoadData;

/**
 * WPOutput.__ReLoadData web service success handler
 */
WPProcessStep__ReLoadData.onSuccess = function(dom, serviceName) {
	if ( null != dom ) {
		Services.setTransientStatusBarMessage("");
		Services.setValue(CHANGES_MADE_XPATH, "N"); } }

/**
 * WPProcessStep__ReLoadData web service business expcetion handler
 */
WPProcessStep__ReLoadData.prototype.onBusinessException = function(exception) {
	if(exception.name == "UpdateLockedException") {
		if(confirm(Messages.WRITE_WRITE_CONFLICT_MSG)) {
			// Reload all data 
		}
		else {
			exitScreen(); } } 
	else {
		alert(Messages.FAILEDSAVE_MESSAGE);
		exitScreen(); } }

/**
 * WPProcessStep__ReLoadData web service system expcetion handler
 */
WPProcessStep__ReLoadData.prototype.onSystemException = function(exception)  {
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen(); }



/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to transform all data sourced from the app
 * into the wp variables xphats structure.
 * @returns void
 * @throws
 */
function WPProcessStep__TransformData() {
}

/**
 *
 */
WPProcessStep__TransformData.prototype = new WPProcessStep();

/**
 *
 */
WPProcessStep__TransformData.prototype.constructor = WPProcessStep__TransformData;

/**
 * WPProcessStep__TransformData web service success handler
 */
WPProcessStep__TransformData.prototype.onSuccess = function(dom, serviceName) {
	if ( null != dom ) {
		Services.setTransientStatusBarMessage("");
		Services.setValue(CHANGES_MADE_XPATH, "N"); } }

/**
 * WPProcessStep__TransformData web service business expcetion handler
 */
WPProcessStep__TransformData.prototype.onBusinessException = function(exception) {
	if(exception.name == "UpdateLockedException")  {
		if(confirm(Messages.WRITE_WRITE_CONFLICT_MSG)) {
			/** Reload all data  **/ }
		else {
			exitScreen(); }	} 
	else {
		alert(Messages.FAILEDSAVE_MESSAGE);
		exitScreen(); } }

/**
 * WPProcessStep__TransformData web service system expcetion handler
 */
WPProcessStep__TransformData.prototype.onSystemException = function(exception)  {
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen(); }



/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to store all output data sourced.
 *
 * @returns void
 * @throws
 */
function WPProcessStep__StoreData() {
}

/**
 *
 */
WPProcessStep__StoreData.prototype = new WPProcessStep();

/**
 *
 */
WPProcessStep__StoreData.prototype.constructor = WPProcessStep__StoreData;
	
/**
 * WPProcessStep__StoreData web service success handler
 */
WPProcessStep__StoreData.prototype.onSuccess = function(dom, serviceName) {
	if ( null != dom ) {
		Services.setTransientStatusBarMessage("");
		Services.setValue(CHANGES_MADE_XPATH, "N"); } }

/**
 * WPProcessStep__StoreData web service business expcetion handler
 */
WPProcessStep__StoreData.prototype.onBusinessException = function(exception) {
	if(exception.name == "UpdateLockedException")  {
		if(confirm(Messages.WRITE_WRITE_CONFLICT_MSG)) {
			/** Reload all data  **/ }
		else {
			exitScreen(); }	} 
	else {
		alert(Messages.FAILEDSAVE_MESSAGE);
		exitScreen(); } }

/**
 * WPProcessStep__StoreData web service system expcetion handler
 */
WPProcessStep__StoreData.prototype.onSystemException = function(exception)  {
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen(); }


/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to load the editor for the output
 * @returns void
 * @throws
 */
function WPProcessStep__LoadEditor() {
	WPProcessStep.apply("LoadEditor")
}

/**
 *
 */
WPProcessStep__LoadEditor.prototype = new WPProcessStep();

/**
 *
 */
WPProcessStep__LoadEditor.prototype.constructor = WPProcessStep__LoadEditor;
	
/**
 * WPProcessStep__LoadEditor web service success handler
 */
WPProcessStep__LoadEditor.prototype.onSuccess = function(dom, serviceName) {
	if ( null != dom ) {
		Services.setTransientStatusBarMessage("");
		Services.setValue(CHANGES_MADE_XPATH, "N"); } }

/**
 * WPProcessStep__LoadEditor web service business expcetion handler
 */
WPProcessStep__LoadEditor.prototype.onBusinessException = function(exception) {
	if(exception.name == "UpdateLockedException")  {
		if(confirm(Messages.WRITE_WRITE_CONFLICT_MSG)) {
			/** Reload all data  **/ }
		else {
			exitScreen(); }	} 
	else {
		alert(Messages.FAILEDSAVE_MESSAGE);
		exitScreen(); } }

/**
 * WPProcessStep__LoadEditor web service system expcetion handler
 */
WPProcessStep__LoadEditor.prototype.onSystemException = function(exception)  {
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen(); }




/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to save the editor for the output
 * @returns void
 * @throws
 */
function WPProcessStep__SaveEditor() {
}

/**
 *
 */
WPProcessStep__SaveEditor.prototype = new WPProcessStep();

/**
 *
 */
WPProcessStep__SaveEditor.prototype.constructor = WPProcessStep__SaveEditor;
	
/**
 * WPProcessStep__SaveEditor web service success handler
 */
WPProcessStep__SaveEditor.prototype.onSuccess = function(dom, serviceName) {
	if ( null != dom ) {
		Services.setTransientStatusBarMessage("");
		Services.setValue(CHANGES_MADE_XPATH, "N"); } }

/**
 * WPProcessStep__SaveEditor web service business expcetion handler
 */
WPProcessStep__SaveEditor.prototype.onBusinessException = function(exception) {
	if(exception.name == "UpdateLockedException")  {
		if(confirm(Messages.WRITE_WRITE_CONFLICT_MSG)) {
			/** Reload all data  **/ }
		else {
			exitScreen(); }	} 
	else {
		alert(Messages.FAILEDSAVE_MESSAGE);
		exitScreen(); } }

/**
 * WPProcessStep__SaveEditor web service system expcetion handler
 */
WPProcessStep__SaveEditor.prototype.onSystemException = function(exception)  {
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen(); }
				
				

/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to load the output as PDF
 * @returns void
 * @throws
 */
function WPProcessStep__ViewPDF() {
}

/**
 *
 */
WPProcessStep__ViewPDF.prototype = new WPProcessStep();

/**
 *
 */
WPProcessStep__ViewPDF.prototype.constructor = WPProcessStep__ViewPDF;
	
/**
 * WPProcessStep__ViewPDF web service success handler
 */
WPProcessStep__ViewPDF.prototype.onSuccess = function(dom, serviceName) {
	if ( null != dom ) {
		Services.setTransientStatusBarMessage("");
		Services.setValue(CHANGES_MADE_XPATH, "N"); } }

/**
 * WPProcessStep__ViewPDF web service business expcetion handler
 */
WPProcessStep__ViewPDF.prototype.onBusinessException = function(exception) {
	if(exception.name == "UpdateLockedException")  {
		if(confirm(Messages.WRITE_WRITE_CONFLICT_MSG)) {
			/** Reload all data  **/ }
		else {
			exitScreen(); }	} 
	else {
		alert(Messages.FAILEDSAVE_MESSAGE);
		exitScreen(); } }

/**
 * WPProcessStep__ViewPDF web service system expcetion handler
 */ 
WPProcessStep__ViewPDF.prototype.onSystemException = function(exception)  {
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen(); }
								
								
								
								
/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to print preview the output
 * in CaseMAN.
 * @returns void
 * @throws
 */
function WPProcessStep__PrintPreview() {
	WPProcessStep.apply("PrintPreview")
}

/**
 *
 */
WPProcessStep__PrintPreview.prototype = new WPProcessStep();

/**
 *
 */
WPProcessStep__PrintPreview.prototype.constructor = WPProcessStep__PrintPreview;
	
/**
 * WPProcessStep__PrintPreview web service success handler
 */
WPProcessStep__PrintPreview.prototype.onSuccess = function(dom, serviceName) {
	if ( null != dom ) {
		Services.setTransientStatusBarMessage("");
		Services.setValue(CHANGES_MADE_XPATH, "N"); } }

/**
 * WPProcessStep__PrintPreview web service business expcetion handler
 */
WPProcessStep__PrintPreview.prototype.onBusinessException = function(exception) {
	if(exception.name == "UpdateLockedException")  {
		if(confirm(Messages.WRITE_WRITE_CONFLICT_MSG)) {
			/** Reload all data  **/ }
		else {
			exitScreen(); }	} 
	else {
		alert(Messages.FAILEDSAVE_MESSAGE);
		exitScreen(); } }

/**
 * WPProcessStep__PrintPreview web service system expcetion handler
 */ 
WPProcessStep__PrintPreview.prototype.onSystemException = function(exception)  {
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen(); }
																
																																																															
/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to print the output as per 'default'
 * in CaseMAN.
 * @returns void
 * @throws
 */
function WPProcessStep__Print_DEFAULT() {
	WPProcessStep.apply("Print_DEFAULT")
}

/**
 *
 */
WPProcessStep__Print_DEFAULT.prototype = new WPProcessStep();

/**
 *
 */
WPProcessStep__Print_DEFAULT.prototype.constructor = WPProcessStep__Print_DEFAULT;
	
/**
 * WPProcessStep__Print_DEFAULT web service success handler
 */
WPProcessStep__Print_DEFAULT.prototype.onSuccess = function(dom, serviceName) {
	if ( null != dom ) {
		Services.setTransientStatusBarMessage("");
		Services.setValue(CHANGES_MADE_XPATH, "N"); } }

/**
 * WPProcessStep__Print_DEFAULT web service business expcetion handler
 */
WPProcessStep__Print_DEFAULT.prototype.onBusinessException = function(exception) {
	if(exception.name == "UpdateLockedException")  {
		if(confirm(Messages.WRITE_WRITE_CONFLICT_MSG)) {
			/** Reload all data  **/ }
		else {
			exitScreen(); }	} 
	else {
		alert(Messages.FAILEDSAVE_MESSAGE);
		exitScreen(); } }

/**
 * WPProcessStep__Print_DEFAULT web service system expcetion handler
 */ 
WPProcessStep__Print_DEFAULT.prototype.onSystemException = function(exception)  {
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen(); }

							
/**
 * WPOutput Nested Class - Interface with Server side data loading / transformations
 * This data loading process step allows the client to clean up the output process
 * in CaseMAN.
 * @returns void
 * @throws
 */
function WPProcessStep__CleanUp() {
	WPProcessStep.apply("CleanUp")
}

/**
 *
 */
WPProcessStep__CleanUp.prototype = new WPProcessStep();

/**
 *
 */
WPProcessStep__CleanUp.prototype.constructor = WPProcessStep__CleanUp;

/**
 * WPProcessStep__CleanUp web service success handler
 */
WPProcessStep__CleanUp.prototype.onSuccess = function(dom, serviceName) {
	if ( null != dom ) {
		Services.setTransientStatusBarMessage("");
		Services.setValue(CHANGES_MADE_XPATH, "N"); } }

/**
 * WPProcessStep__CleanUp web service business expcetion handler
 */
WPProcessStep__CleanUp.prototype.onBusinessException = function(exception) {
	if(exception.name == "UpdateLockedException")  {
		if(confirm(Messages.WRITE_WRITE_CONFLICT_MSG)) {
			/** Reload all data  **/ }
		else {
			exitScreen(); }	} 
	else {
		alert(Messages.FAILEDSAVE_MESSAGE);
		exitScreen(); } }

/**
 * WPProcessStep__CleanUp web service system expcetion handler
 */ 
WPProcessStep__CleanUp.prototype.onSystemException = function(exception)  {
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen(); }						