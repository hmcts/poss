/** 
 * Word Processing Services class.
 * This is the interface with the SUPS Client Framework,
 * formalizing the relationship between Word Processing ana the/a specific client framework.
 */
function WPS() {}

/** 
 * WPS Private function, giving access to the Services js class loaded on the currently active form window/frame.
 * (whereas the (running) WPS is typically loaded with the WPCtrl in an visibile frame/window.
 * @returns Services
 * @type Services
 */
WPS.__Services = function() {
	var appctrl = top.AppController.getInstance();
	var win = appctrl.m_mainFormView._getWindow();
	return  win.Services; }

/** 
 * WPS Private function, giving access to the Reports js class loaded on the currently active form window/frame.
 * (whereas the (running) WPS is typically loaded with the WPCtrl in an visibile frame/window.
 * @returns Services
 * @type Services
 */
WPS.__Reports = function() {
	var appctrl = top.AppController.getInstance();
	var win = appctrl.m_mainFormView._getWindow();
	return  win.Reports; }
	
/**
 * WPS Private function, giving access to the CaseManFormParameters js class loaded on the currently active form window/frame.
 * (whereas the (running) WPS is typically loaded with the WPCtrl in an visibile frame/window. 
 * @returns CaseManUtils
 * @type CaseManUtils
 */	
WPS.__CaseManFormParameters = function() {
	var appctrl = top.AppController.getInstance();
	var win = appctrl.m_mainFormView._getWindow();
	return  win.CaseManFormParameters; }
	
/**
 * WPS Private function, giving access to the CaseManUtils js class loaded on the currently active form window/frame.
 * (whereas the (running) WPS is typically loaded with the WPCtrl in an visibile frame/window. 
 * @returns CaseManUtils
 * @type CaseManUtils
 */	
WPS.__CaseManUtils = function() {
	var appctrl = top.AppController.getInstance();
	var win = appctrl.m_mainFormView._getWindow();
	return  win.CaseManUtils; }
	
/**
 * WPS Private function, giving access to the currently active form window/frame.
 * (whereas the (running) WPS is typically loaded with the WPCtrl in an visibile frame/window.
 * @returns window
 * @type window
 */	
WPS.__win = function() {
	var appctrl = top.AppController.getInstance();
	var win = appctrl.m_mainFormView._getWindow();
	return  win; }

/**
 * WPS Private function, giving access to the CaseManFormParameters js class loaded on the currently active form window/frame.
 * (whereas the (running) WPS is typically loaded with the WPCtrl in an visibile frame/window.
 * @returns CaseManFormParameters
 * @type CaseManFormParameters
 */	
WPS.__CaseManFormParameters = function() {
	var appctrl = top.AppController.getInstance();
	var win = appctrl.m_mainFormView._getWindow();
	return  win.CaseManFormParameters; }
		
/** 
 * WPS Private function, used to execute class functions on the Services objects returned by WPS.__Services()
 * @argument functionName	name of the class function to be executed on the 'running' Services
 * @argument args			array of arguments to be passed into the function call on Services
 * @returns	 				what the Service.functionName(args) call returns
 * @type Object
 */
WPS.__TOPExec = function(functionName, args) {
	var str = "WPS.__Exec("+functionName+", "+args+") ";
	var svc = top.Services;
	if (null == svc) throw new Error("SUPS ClientFramework not accessible to Word Processing module.\n\nCould not execute Services."+functionName+"("+args+")");
	if (doT) {
		//try {
			return svc[functionName].apply(svc, args); 
			/**}
		catch(err) {
			str +"\nException framework call Services." + functionName + " (" +args+")";
			if (doLog) do_Log(str,err); } **/ }
	else {
		return svc[functionName].apply(svc, args); } }
		
/** 
 * WPS Private function, used to execute class functions on the Services objects returned by WPS.__Services()
 * @argument functionName	name of the class function to be executed on the 'running' Services
 * @argument args			array of arguments to be passed into the function call on Services
 * @returns	 				what the Service.functionName(args) call returns
 * @type Object
 */
WPS.__Exec = function(functionName, args) {
	var str = "WPS.__Exec("+functionName+", "+args+") ";
	var svc = WPS.__Services();
	if (null == svc) throw new Error("SUPS ClientFramework not accessible to Word Processing module.\n\nCould not execute Services."+functionName+"("+args+")");
	if (doT) {
		try {
			return svc[functionName].apply(svc, args); }
		catch(err) {
			str +"\nException framework call Services." + functionName + " (" +args+")";
			if (doLog) do_Log(str,err); }  }
	else {
		return svc[functionName].apply(svc, args); } }

/** 
 * WPS Private function, used to execute instance functions on the Services objects returned by WPS.__Services()
 * @argument functionName	name of the instance function to be executed on the 'running' Services
 * @argument args			array of arguments to be passed into the function call on Services
 * @returns	 				what the Service.functionName(args) call returns
 * @type Object
 */
WPS.__exec = function(functionName, args) {
	var str = "WPS.__exec("+functionName+", "+args+") ";
	var svc = WPS.__Services();
	if (null == svc) throw new Error("SUPS ClientFramework not accessible to Word Processing module.\n\nCould not execute Services.prototype."+functionName+"("+args+")");
	if (doT) {
		try {
			return svc.prototype[functionName].apply(svc, args); }
		catch(err) {
			str +"\nException framework call Services.prototype." + functionName + " (" +args+")";
			if (doLog) do_Log(str,err); }  }
	else {
		return svc.prototype[functionName].apply(svc, args); } }		

/**
 *
 *
 *
 * Facade containing all services available to client side code
 *
 *
 *
 *
 */

/**
 *
 */
WPS.loadDOMFromURL = function(url) {

	if (top.Services && top.Services.loadDOMFromURL)
	{
		// fwk 9.0.6 or higher
		return WPS.__TOPExec("loadDOMFromURL", [url]);
	}
	else
	{
		// fwk < 9.0.6
		var dom = XML.createDOM();
		dom.async = false;
		dom.load(url);
		return dom;
	}
}


/**
 * Delegates NavigateTo() to the SUPS Client Framework
 */
WPS.NavigateTo = function(x) {
	WPS.__Exec("navigate", [x]); }
		
/**
 * Delegate getAppController() to the SUPS Client Framework
 */
WPS.getAppController = function() {
	return WPS.__Exec("getAppController"); }
	
/**
 * Call Server Side service
 * The handler is an object which is called to process callbacks resulting from this service call. 
 * The onSuccess method is called when the service returns without error. This method must be implemented. 
 * The handler object may also implement a number of exception handlers, onXXX where XXX is the name of the exception being handled. 
 * The most specific exception handler implemented will be called. If no method exists for the specific exception being thrown, 
 * the exception class hierarchy is traversed with the most specialist exception handler that is implemented being called.
 * Exception handlers are optional. When none are defined, the framework default handler will be executed.
 * This method will only throw an exception if the handler object passed in cannot be used for communication (i.e. it does not implement onSuccess)
 * @param mappingName name of the mapping of the service within this form
 * @param parameters the parameters required by the service
 * @param handler Object which implements onSuccess and onXXX where XXX is an exception methods
 * @param sync Currently ignored - all services are asyncronous
 * @param showProcess 
 */
WPS.callService = function(mappingName, parameters, handler, async, showProgress) {
	return WPS.__Exec("callService", [mappingName, parameters, handler, async, showProgress]); }

/**
 * Sets the focus to the specified adaptor
 * If the adaptor is not capable of accepting focus then the next available adaptor will receive focus
 */
WPS.setFocus = function(adaptorId) {
	return WPS.__Exec("setFocus", [adaptorId]); }

/**
 * Sets the focus to the specified adaptor
 * If the adaptor is not capable of accepting focus then the next available adaptor will receive focus
 */
WPS.showDocument = function(docid, docid2) {
	return WPS.__Exec("showDocument", [docid, docid2]); }

/**
 * Set the forms XML data document
 * @param doc the XML document containing the forms data
 */
WPS.setFormData = function(doc) {
	var str = "WPS.setFormData("+doc+")";
	if (doT) {
		try {
			WPS.__Services().setFormData(doc); }
		catch(err) {
			str +"\nException framework call Services.setFormData("+doc+");";	
			if (doLog) do_Log(str,err); } }
	else {
		WPS.__Services().setFormData(doc); } }

/**
 * Set the value of a node in the Data Model
 * @param xp the path of the node whose value to set
 * @param v the value
 */
WPS.setValue = function(xp, v) {
	if (doLog) do_Log("WPS.setValue("+xp+","+v+")");
	return WPS.__Exec("setValue", [xp, v]); }

/**
 * Get the value of a node in the Data Model
 * @param xp the path of the node whose value to get
 */
WPS.getValue = function(xp) {	
	return WPS.__Exec("getValue", [xp]); }

/**
 * Removes a node in the Data Model
 * @param xp the path of the node whose value to remove
 */
WPS.removeNode = function(xp) {	
	return WPS.__Exec("removeNode", [xp]); }

/**
 * Adds a node into the Data Model
 * @param toXPath the xpath to copy the node to
 * @param fromDom the dom to copy the node from
 */
WPS.addNode = function(fromDom,toXPath) {
	return WPS.__Exec("addNode", [fromDom, toXPath]); }

/**
 * Replaces a node in the Data Model *
 * @param xp the xpath in the dom to overwrite the existing nodes
 * @param node the dom to copy the nodeset from
 */
WPS.replaceNode = function(xp, node) {
	return WPS.__Exec("replaceNode", [xp, node]); }

/**
 * Starts a transaction in the Data Model
 */
WPS.startTransaction = function() {
	return WPS.__Exec("startTransaction"); }

/**
 * Ends a transaction in the Data Model
 */
WPS.endTransaction = function() {
	return WPS.__Exec("endTransaction"); }

/**
 * Check if a node exists
 * @param xp the xpath of the node to check for existance
 */
WPS.exists = function(xp) {
	return WPS.__Exec("exists", [xp]); }

/**
 * Returns the number of nodes selected by the XPath
 * @param xp the xpath of the nodes to count
 * @return the number of nodes selected by the XPath
 * @type Integer
 */
WPS.countNodes = function(xp) {
	return WPS.__Exec("countNodes", [xp]); }

/**
 * Returns a cloned node from selected by the XPath
 */
WPS.getNode = function(xp) {
	return WPS.__Exec("getNode", [xp]); }

/**
 * Returns a cloned set of nodes from selected by the XPath
 */
WPS.getNodes = function(xp) {
	return WPS.__Exec("getNodes", [xp]); }

/**
 * Check if a node has a value or not
 */
WPS.hasValue = function(xpath) {
	return WPS.__Exec("hasValue", [xpath]);	}

/**
 * Dispatch a Business Life Cycle Event to a GUI Adaptor *
 * @param id the id of the GUIAdaptor to send the event to
 * @param type the type of event to dispatch
 * @param detail additional detail object required by the particular event type. May be null.
 */
WPS.dispatchEvent = function(id, type, detail) {
	return WPS.__Exec("dispatchEvent" ,[id, type, detail]); }

/**
 * Set a transient message in the status bar.
 */
WPS.setTransientStatusBarMessage = function(message) {
	return WPS.__Exec("setTransientStatusBarMessage", [message]); }

/**
 * Gets the adaptor given it's id. Will return null if no such adaptor is found
 * @param id the adaptor of the adaptor to retrieve
 * @return the adaptor corresponding to the id
 */
WPS.getAdaptorById = function(id) {
	return FormController.getInstance().getAdaptorById(id); }
		
/**
 * WPS Service delegation function - UserName.
 * @type String
 * @returns username of the user currently logged on in the application.
 */
WPS.GetUserName = function() {
	var str = "WPS.GetUserName()";
	var cmUtils = WPS.__CaseManUtils();
	var cmParam = WPS.__CaseManFormParameters();
	if (doT) {
		try {
			return cmUtils.getUserParameter(cmParam.USERNAME_XPATH, "anonymous");	}
		catch(err) {
			str +"\nException " + err;	
			if (doLog) do_Log(str,err); } }
	else {
		cmUtils.getUserParameter(cmParam.USERNAME_XPATH, "anonymous"); } }

/**
 * Creates a DOM object.
 * Temporariliy the MSIE specific impl only - to become the framework XML class call
 * @type DOM
 * @argument a aaa
 * @argument b bbb
 * @argument c ccc
 * @returns DOM
 */
WPS.createDOM = function (a,b,c) {
	var dom = XML.createDOM(a,b,c);
	return dom; }
	
/**
 *
 * @type String
 * @argument n node
 * @returns String
 */
WPS.getNodeTextContent = function(n) {
	var t = null;
	if (null != n) {
		var f = false;
		var cn = n.childNodes;
		for(var i = 0, l = cn.length; i < l; i++) {
			var c = cn[i];
			if(3 == c.nodeType) {
				t = (null == t) ? c.nodeValue : t + c.nodeValue; } } }
	return t; }	

/**
 * Convenience method to the specified node's text the value specified
 * @param n the node whose text content to set
 * @param v the value to set the node text content to
 */
WPS.replaceNodeTextContent = function(n, v) {
	var r = new Array();  
	var cn = n.childNodes;
	for(var i = 0, l = cn.length; i < l; i++) {
		var c = cn[i];
		if(3 == c.nodeType) {
			r.push(c); } }
	for(var i = 0, l = r.length; i < l; i++) {
		n.removeChild(r[i]); }
	if(null != v) {
		var t = WPS.createTextNode(n.ownerDocument, v);
		n.appendChild(t); } }

/** 
 * Convenience method to create a text node in a document or the document of a node
 * @param value Value of the TextNode being created.
 * @return the created TextNode
 */
WPS.createTextNode = function(node, value) {
	if(node.ownerDocument) {
		return node.ownerDocument.createTextNode(value); }
	else {
		return node.createTextNode(value); } }
