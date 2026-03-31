/**
 * Additional methods for adding automated testing support
 * to the framework.
 */
 
/**
 * Loads in script using the logical name and url provided, will assume
 * a function call {scriptName}.test
 * 
 * @param scriptName The logical name of the script to load
 * @param scriptURL The url of the script to load
 */
AppController.prototype.loadTestScript = function(scriptName, scriptURL)
{
	var e = document.createElement("script");
	e.src = scriptURL;
	e.type = "text/javascript";
	var es = document.getElementsByTagName("HEAD");
	if (es.length > 0)
	{
		es[0].appendChild(e);
	}
	else
	{
		alert("Unable to find head element");
	}
	
	if (!this.m_testScripts)
	{
		this.m_testScripts = new Array();
	}
	
	this.m_testScripts.push(scriptName);
}


AppController.prototype.startTests = function()
{
	for (var i in this.m_testScripts)
	{
		var scriptName = this.m_testScripts[i];
		this.startTestScript(scriptName);
	}
}


/**
 * Starts the specified script.
 * 
 * @param scriptName the name of the script to start
 */
AppController.prototype.startTestScript = function(scriptName)
{
	var harness = TestHarness.create(scriptName, this);
	var script = scriptName + ".create(harness)";
	var test = eval(script);
	this.m_formReadyListeners = new Array();
	this.m_sericeCompleteListeners = new Array();
	this.m_lifeCycleCompleteListeners = new Array();
	harness.start(test);
}

/**
 * Notifies any listeners to service calls if they are complete.
 */
AppController.prototype._serviceComplete = function()
{
	if (this.m_serviceCompleteListeners)
	{
		for (var i in this.m_serviceCompleteListeners)
		{
			var listener = this.m_serviceCompleteListeners[i];
			listener.call();
		}
	}
}

AppController.prototype._lifeCycleComplete = function()
{
	if (this.m_lifeCycleCompleteListeners)
	{
		for (var i in this.m_lifeCycleCompleteListeners)
		{
			var listener = this.m_lifeCycleCompleteListeners[i];
			listener.call();
		}
	}
}

/**
 * --OVERRIDE--
 *
 * Overrides the appcontrollers form ready function so that we can notify
 * the test script.
 */
AppController.prototype._formReady = function()
{
	// When FormController is completely initialised lower the status bar again.
	this._hideProgress();
	
	// Hook to call back to the test to notify that the page is loaded.
	if (this.m_formReadyListeners)
	{
		for (var i in this.m_formReadyListeners)
		{
			var listener = this.m_formReadyListeners[i];
			listener.call();
		}
	}
}



/**
 * --OVERRIDE--
 *
 * Dispatch a BusinessLifeCycleEvent to a component
 *
 * @param id the id of the GUIAdaptor to send the event to
 * @param type the type of event to dispatch
 * @param detail additional detail object required by the particular event type. May be null.
 */
FormController.prototype.dispatchBusinessLifeCycleEvent = function(id, type, detail)
{
	if(FormController.m_logger.isDebug()) 
	{
		FormController.m_logger.debug("Dispath business life cycle event id: " + id + ", type: " + type + ", detail: " + detail);
	}

	var q = this.m_businessLifeCycleEventQueue;
	q[q.length] = BusinessLifeCycleEvent.create(id, type, detail);
	
	if(this.m_businessLifeCycleEventTimeout == null)
	{
		var thisObj = this;
		var appC = this.getAppController();
		this.m_businessLifeCycleEventTimeout = setTimeout(function() { thisObj.processEvents(); appC._lifeCycleComplete(); }, 0);
	}
}


/**
 * --OVERRIDE--
 *
 * Handle a successful dom creation (may be overriden by sublclasses 
 * (for example a successful dom creation may still not be a successful call)
 */                
fwDataService.prototype._processSuccessfulDOMCreation = function(dom)
{
    // Success loading the data - invoke the onSuccess method
	this.m_resultHandler.onSuccess(dom, this.m_serviceMethodName);
	
	var ac = Services.getAppController();
	ac._serviceComplete();
}


function TestHarness() {}

TestHarness.prototype = new Object();
TestHarness.prototype.constructor = TestHarness;

TestHarness.create = function(name, appC)
{
	var harness = new TestHarness();
	harness.appC = appC;
	harness.name = name;
	harness.results = new Array();
	return harness;
}

TestHarness.prototype.start = function(test)
{
	try
	{
		test.start();
	}
	catch (exception)
	{
		this.results.push({ status: "Error", message: exception.message});
	}
}

/**
 * Notification that the currently running test has 
 * completed
 */
TestHarness.prototype.finish = function()
{
	var lines = new Array();
	lines.push("Test Results for: " + this.name);
	for (var i in this.results)
	{
		var result = this.results[i];
		lines.push(i + ": Status: " + result.status + ", Message: " + result.message);
	}
	var str = lines.join("\n");
	alert(str);
}

/**
 * Loads a specified form
 *
 * @param The name of the form to load
 */
TestHarness.prototype.loadForm = function(formName, callback)
{
	if (callback)
	{
		this.appC.m_formReadyListeners.push(callback);
	}
	this.appC.navigate(formName, NavigateFormBusinessLifeCycle.FORM);
}

/**
 * Sets a value on a component.  Component must support
 * the databinding protocol.
 *
 * @param id The id of the component
 * @param value The value to set for the component
 * @return void
 */
TestHarness.prototype.setElementValue = function(id, value)
{
	var adaptor = this.getAdaptorById(id);
	adaptor.m_element.value = value;
	adaptor.update();
}

/**
 * Gets the HTML Elements value for a specified id
 *
 * @param id The id of the component
 * @return The HTML Element value
 */
TestHarness.prototype.getElementValue = function(id)
{
	var adaptor = this.getAdaptorById(id);
	return adaptor.m_element.value;
}

/**
 * Sets a value in the XML DOM
 *
 * @param id The id of the component
 * @param value The value to put in the DOM
 * @return void
 */
TestHarness.prototype.setModelValue = function(id, value)
{
	var adaptor = this.getAdaptorById(id);
	this.getFormController().getDataModel().setValue(adaptor.dataBinding, value);
}

/**
 * Gets the XML DOM value for the specified id
 *
 * @param id The id of the component
 * @return The XML DOM Value
 */
TestHarness.prototype.getModelValue = function(id)
{
	var adaptor = this.getAdaptorById(id);
	return this.getFormController().getDataModel().getValue(adaptor.dataBinding);
}

TestHarness.prototype.doAction = function(id, callback)
{
	var adaptor = this.getAdaptorById(id);
}

/**
 * Dispatches an event to the appropriate component
 */
TestHarness.prototype.dispatchEvent = function(id, event, detail)
{
	this.getFormController().dispatchBusinessLifeCycleEvent(id, event, detail);
}

TestHarness.prototype.getAdaptorById = function(id)
{
	return this.getFormController().getAdaptorById(id);
}

TestHarness.prototype.getFormController = function()
{
	return this.appC.m_mainFormView.getFormController();
}


TestHarness.prototype.assertTrue = function(_message, condition)
{
	if (condition)
	{
		this.results.push({ status: "Success", message: "" });
	}
	else
	{
		this.results.push({ status: "Failure", message: _message });
	}
}
