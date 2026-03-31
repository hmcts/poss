//=================================================
//
// CaseManAsyncMonitorGUIAdaptor.js
//
//=================================================

/**
 * Class for monitoring the state of asynchronous calls.
 *
 * 
 */
 
function CaseManAsyncMonitorGUIAdaptor() {};

CaseManAsyncMonitorGUIAdaptor.m_logger = new Category("CaseManAsyncMonitorGUIAdaptor");

/**
 * CaseManAsyncMonitorGUIAdaptor is sub-class of HTMLElement
 */
 
CaseManAsyncMonitorGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
CaseManAsyncMonitorGUIAdaptor.prototype.constructor = CaseManAsyncMonitorGUIAdaptor;

/**
 * Set up protocols
 */

GUIAdaptor._setUpProtocols('CaseManAsyncMonitorGUIAdaptor'); 

/**
 * Default idXPath.
 *
 * @type String
 * @configuration Optional
 */
CaseManAsyncMonitorGUIAdaptor.prototype.idXPath = "Id";

/**
 * Default stateXPath
 *
 * @type String
 * @configuration Optional
 */
CaseManAsyncMonitorGUIAdaptor.prototype.stateXPath = "State";

/**
 * Default timeRemainingXPath
 *
 * @type String
 * @configuration Optional
 */
 
CaseManAsyncMonitorGUIAdaptor.prototype.timeRemainingXPath = "Eta";

/**
 * Default responseXPath
 *
 * @type String 
 * @configuration Optional
 */
CaseManAsyncMonitorGUIAdaptor.prototype.responseXPath = "Response";

/**
 * Default minimum timeout value.  Prevents very high frequency
 * hammering of the server.
 */
CaseManAsyncMonitorGUIAdaptor.prototype.minTimeout = 1000;

/**
 * Default maximum timeout value.  Prevent very long wait between
 * requests of async state.
 */
CaseManAsyncMonitorGUIAdaptor.prototype.maxTimeout = 10000;

/**
 * If true then create the underlying structure in the
 * dom to hold the async state.
 */
CaseManAsyncMonitorGUIAdaptor.prototype.isCreateNode = true;

/**
 * Called when the async processing has completed.
 * @author rzmb1g
 * 
 */
CaseManAsyncMonitorGUIAdaptor.prototype.onComplete = function() {}

/**
 * Called when the user cancels the async request.
 * @author rzmb1g
 * 
 */
CaseManAsyncMonitorGUIAdaptor.prototype.onCancel = function() {}

/**
 * Called when the async call throws an exception.
 * @param exception
 * @author rzmb1g
 * 
 */
CaseManAsyncMonitorGUIAdaptor.prototype.onError = function(exception)
{
	alert("Error: " + exception.message);
}

/**
 * Called when the async cancellation throws an exception.
 * @param exception
 * @author rzmb1g
 * 
 */
CaseManAsyncMonitorGUIAdaptor.prototype.onCancelError = function(exception)
{
	alert("Error: " + exception.message);
}


/**
 * Property holding the id of the timeout.  Used when it is necessary to 
 * clear the timeout.
 */
CaseManAsyncMonitorGUIAdaptor.prototype.m_timeoutId = null;


/**
 * Clean up after the component is destroyed
 * @author rzmb1g
 * 
 */
CaseManAsyncMonitorGUIAdaptor.prototype._dispose = function()
{
	if(CaseManAsyncMonitorGUIAdaptor.m_logger.isInfo()) CaseManAsyncMonitorGUIAdaptor.m_logger.info("CaseManAsyncMonitorGUIAdaptor.dispose()");

	// Break circular reference in HTML
	this.m_element.__renderer = null;
	this._clearTimer();
}

/**
 * Creates a new instance of the AsyncMonitor given 
 * an element e.
 *
 * @param e The HTML element to manage.
 * @return The new CaseManAsyncMonitorGUIAdaptor
 * @type CaseManAsyncMonitorGUIAdaptor
 * @author rzmb1g
 */
CaseManAsyncMonitorGUIAdaptor.create = function(e)
{
	if(CaseManAsyncMonitorGUIAdaptor.m_logger.isInfo()) CaseManAsyncMonitorGUIAdaptor.m_logger.info("CaseManAsyncMonitorGUIAdaptor.create()");
	var a = new CaseManAsyncMonitorGUIAdaptor();
	a._initCaseManAsyncMonitorGUIAdaptor(e);
	
	return a;
}

/**
 * Initialises this Adaptor with the specified element
 *
 * @param e The element to manage.
 * @author rzmb1g
 * 
 */
CaseManAsyncMonitorGUIAdaptor.prototype._initCaseManAsyncMonitorGUIAdaptor = function(e)
{
	if(CaseManAsyncMonitorGUIAdaptor.m_logger.isInfo()) CaseManAsyncMonitorGUIAdaptor.m_logger.info("CaseManAsyncMonitorGUIAdaptor._initCaseManAsyncMonitorGUIAdaptor()");
	this.m_element = e;
}

/**
 * Configures the AysncMonitor
 *
 * @param cs The configurations.
 * @author rzmb1g
 * @return boolean, result , thisObj._getAsyncState().isViewable  
 */
CaseManAsyncMonitorGUIAdaptor.prototype._configure = function(cs)
{
	for (var i = 0; i < cs.length; i++)
	{
		var c = cs[i];
		
		this._setAttribute(c, "asyncStateService");
		this._setAttribute(c, "asyncCancelService");
		this._setAttribute(c, "srcData");
		this._setAttribute(c, "idXPath");
		this._setAttribute(c, "stateXPath");
		this._setAttribute(c, "timeRemainingXPath");
		this._setAttribute(c, "responseXPath");
		this._setAttribute(c, "onComplete");
		this._setAttribute(c, "onCancel");
		this._setAttribute(c, "onError");
		this._setAttribute(c, "onCancelError");
	}
	
	if (this.asyncStateService == null)
	{
		throw new ConfigurationException("asyncStateService is a required configuration parameter");
	}
	if (this.asyncCancelService == null)
	{
		throw new ConfigurationException("asyncCancelService is a required configuration parameter");
	}
	
	var id = this.m_element.id;
	
	if (this.isCreateNode)
	{
		var dom = XML.createDOM(null, null, null);
		var eAsync = dom.createElement("Async");
		
		var eId = dom.createElement("Id");
		eAsync.appendChild(eId);
		
		var eState = dom.createElement("State");
		XML.replaceNodeTextContent(eState, "5");
		eAsync.appendChild(eState);
		
		var eEta = dom.createElement("Eta");
		XML.replaceNodeTextContent(eEta, "0");
		eAsync.appendChild(eEta);
		
		var eResponse = dom.createElement("Response");
		eAsync.appendChild(eResponse);
		
		Services.replaceNode(this.srcData, eAsync);
	}
		
	// Reference to the adaptor to allow for callbacks
	// to this particular instance.
	var thisObj = this;
	
	var stateCtor = function(){};
	window[id + "_state"] = stateCtor;
	stateCtor.dataBinding = this._getStateXPath();
	stateCtor.isReadOnly = function() { return true; };
	stateCtor.transformToDisplay = function() 
	{
		var result = "";
		if (Services.hasValue(this.dataBinding))
		{
			var stateStr = Services.getValue(this.dataBinding);
			var state = parseInt(stateStr);
			result = CaseManAsyncMonitorGUIAdaptor.AsyncState[state].name;
		}
		return result;
	};
	
	var remainingCtor = function() {};
	window[id + "_remaining"] = remainingCtor;
	remainingCtor.dataBinding = this._getTimeRemainingXPath();
	remainingCtor.isReadOnly = function() { return true; };
	remainingCtor.transformToDisplay = function()
	{
		var result = "";
		if (Services.hasValue(this.dataBinding))
		{
			var timeStr = Services.getValue(this.dataBinding);
			var time = parseFloat(timeStr)/1000;
			var mins = Math.floor(time / 60);
			var secs = Math.round(time % 60);
			result = mins + ":" + ((secs) > 9 ? secs : "0" + secs) ;
		}
		return result;
	};
	
	var cancelCtor = function(){};
	window[id + "_cancel"] = cancelCtor;
	cancelCtor.actionBinding = function()
	{
		thisObj._cancel();
	}
	
	/*
	var viewCtor = function() {};
	window[id + "_view"] = viewCtor;
	viewCtor.actionBinding = this.view;
	viewCtor.enableOn = new Array(this._getStateXPath());
	viewCtor.isEnabled = function()
	{
		return thisObj._getAsyncState().isViewable;
	}
	*/
	
	this.logicOn = new Array(stateCtor.dataBinding);
}

/**
 * Sets an attribute with the specified name.
 *
 * @config The configuration to get the information from.
 * @name The name of the attribute to set.
 * @param config
 * @param name
 * @author rzmb1g
 * 
 */
CaseManAsyncMonitorGUIAdaptor.prototype._setAttribute = function(config, name)
{
	if (config[name] != null)
	{
		this[name] = config[name];
	}
}

/**
 * Starts or stops the interval timer based upon the state
 * of the AsyncRequest.
 * @author rzmb1g
 * 
 */
CaseManAsyncMonitorGUIAdaptor.prototype.logic = function()
{
	var timeRemaining = this._getTimeRemaining();
	var state = this._getAsyncState();
	if (state.isPollable)
	{
		var interval = this._getInterval(timeRemaining);
		var thisObj = this;
		this.m_timeoutId = window.setTimeout(function() { thisObj._poll(); }, interval);
	}
	else 
	{
		this._clearTimer();
		if (state.isComplete)
		{
			this.onComplete();
		}
	}
}

/**
 * Clears the time if it appears to be running
 * @author rzmb1g
 * 
 */
CaseManAsyncMonitorGUIAdaptor.prototype._clearTimer = function()
{
	if (this.m_timeoutId != null)
	{
		window.clearTimeout(this.m_timeoutId);
	}
	this.m_timeoutId = null;
}

/**
 * Gets an appropriate timeout interval.
 * @param timeRemaining
 * @author rzmb1g
 * @return Math.round(Math.min(this.maxTimeout, Math.max(this.minTimeout, timeRemaining/3)))  
 */
CaseManAsyncMonitorGUIAdaptor.prototype._getInterval = function(timeRemaining)
{
	return Math.round(Math.min(this.maxTimeout, Math.max(this.minTimeout, timeRemaining/3)));
}

/**
 * Actual function that polls the server.
 * @author rzmb1g
 * 
 */
CaseManAsyncMonitorGUIAdaptor.prototype._poll = function()
{
	var state = this._getAsyncState();
	if (state.isPollable)
	{
		var thisObj = this;
		
		var params = new ServiceParams();
		params.addSimpleParameter("RequestId", this._getRequestId());
		
		var handler = new Object();
		handler.onSuccess = function(dom) 
		{ 
			Services.replaceNode(thisObj.srcData, dom);
		};
		handler.onError = this.onError;
		
		Services.callService(this.asyncStateService, params, handler, true, false);
	}
}


/**
 * Cancels the processing of the async request as well
 * as the polling for state.
 * @author rzmb1g
 * 
 */
CaseManAsyncMonitorGUIAdaptor.prototype._cancel = function()
{
	Services.setValue(this._getStateXPath(), CaseManAsyncMonitorGUIAdaptor.CANCELLED_STATE);
	var params = new ServiceParams();
	params.addSimpleParameter("RequestId", this._getRequestId());
	
	var handler = new Object();
	var thisObj = this;
	handler.onSuccess = function(dom) { thisObj.onCancel(); };
	handler.onError = this.onCancelError;
	Services.callService(this.asyncCancelService, params, handler);
}


/**
 * Gets the full XPath to the state variable
 *
 * @author rzmb1g
 * @return this.srcData + "/" + this.stateXPath  
 */
CaseManAsyncMonitorGUIAdaptor.prototype._getStateXPath = function()
{
	return this.srcData + "/" + this.stateXPath;
}

/**
 * Gets the full XPath to the time remaining.
 *
 * @author rzmb1g
 * @return this.srcData + "/" + this.timeRemainingXPath  
 */
CaseManAsyncMonitorGUIAdaptor.prototype._getTimeRemainingXPath = function()
{
	return this.srcData + "/" + this.timeRemainingXPath;
}

/**
 * Returns the state object for the current state.
 * @author rzmb1g
 * @return CaseManAsyncMonitorGUIAdaptor.AsyncState[state]  
 */
CaseManAsyncMonitorGUIAdaptor.prototype._getAsyncState = function()
{
	var stateStr = Services.getValue(this._getStateXPath());
	var state = parseInt(stateStr);
	return CaseManAsyncMonitorGUIAdaptor.AsyncState[state];
}

/**
 * Gets the amount of time remaining in milliseconds.
 * @author rzmb1g
 * @return parseInt(timeStr)  
 */
CaseManAsyncMonitorGUIAdaptor.prototype._getTimeRemaining = function()
{
	var timeStr = Services.getValue(this._getTimeRemainingXPath());
	return parseInt(timeStr);
}

/**
 * @author rzmb1g
 * @return Services.getValue(path)  
 */
CaseManAsyncMonitorGUIAdaptor.prototype._getRequestId = function()
{
	var path = this.srcData + "/" + this.idXPath;
	return Services.getValue(path);
}

/**
 * Noop function required when component is disabled.
 * @author rzmb1g
 * 
 */
CaseManAsyncMonitorGUIAdaptor.prototype.renderState = function() {}

CaseManAsyncMonitorGUIAdaptor.COMPLETED_STATE = 0;
CaseManAsyncMonitorGUIAdaptor.QUEUED_STATE = 1;
CaseManAsyncMonitorGUIAdaptor.PROCESSING_STATE = 2;
CaseManAsyncMonitorGUIAdaptor.ERROR_STATE = 3;								  
CaseManAsyncMonitorGUIAdaptor.CANCELLED_STATE = 4;

/**
 * States for the async command.
 */
CaseManAsyncMonitorGUIAdaptor.AsyncState = new Array({name:"Completed",  isPollable:false, isViewable:true,  isComplete:true}, 
											  {name:"Queued",     isPollable:true,  isViewable:false, isComplete:false}, 
											  {name:"Processing", isPollable:true,  isViewable:false, isComplete:false}, 
											  {name:"Error",      isPollable:false, isViewable:false, isComplete:false}, 
											  {name:"Cancelled",  isPollable:false, isViewable:false, isComplete:false},
											  {name:"N/A",        isPollable:false, isViewable:false, isComplete:false});


