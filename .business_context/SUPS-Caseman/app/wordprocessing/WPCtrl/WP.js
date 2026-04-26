/**
 * @fileoverview
 * This file represents the <i>base</i> and the <code>API</code> for SUPS Word Processing
 * Author: Frederik Vandendriessche
 */
/**
 * SUPS Word Processing API / Root / Abstract JavaScrpit Class
 * <pre>Represents the public interface to the SUPS Word Processing Controller.
 * The Word Processing controller acts as manager for 'word processing application tasks' such as
 * - determining what output to create when (based upon context provided via xml fragment)
 * - navigating to enter variable data screens
 * - navigating to the word processor screen
 * - navigating to the spell checker
 * - interacting with the server side component to interchange data, meta data and output document.
 * The API is represented by the static functions exposed on the WP JavaScript Class.
 * The WP Class implements the logic to locate the singleton WPCtrl (subclass) instance.</pre>
 */
function WP() {}

/**
 * SUPS Word Processing
 * WP is the root to all Word Processing
 */
WP.prototype = WP;

/**
 * API: SUPS Application Screens invoke this function to start CaseMan Word Processing (if any)
 * @argument type				type of controller to invoke [ 'CaseManWPCtrl' or 'OracleReportController' (subclasses)
 * @argument formController		formController managing the 'current' form requesting the word processing
 * @argument context		 	xml fragment stating the context for the request
 * @argument callback			callback (function or formname)
 * @argument allwaysCallback 	indicator whether or not to always call the callback, or only after the controller made the appliction navigate away from the 'current' form.
 * @returns 	void
 * @throws  	
 */
WP.Process = function(type, formController, context, callback, alwaysCallback) {
	return WP.__DO(type, WPCtrl.prototype.process, [WPS, formController, context, callback, alwaysCallback]); }

/**
 * API: SUPS Application Screens invoke this function to start CaseMan XSL-FO Word Processing (if any)
 * @argument formController		formController managing the 'current' form requesting the word processing
 * @argument context		 	xml fragment stating the context for the request
 * @argument callback			callback (function or formname)
 * @argument allwaysCallback 	indicator whether or not to always call the callback, or only after the controller made the appliction navigate away from the 'current' form.
 * @returns 	void
 * @throws  	
 */
WP.ProcessWP = function(formController, context, callback, alwaysCallback) {
	return WP.__DO("CaseManWPCtrl", CaseManWPCtrl.prototype.process, [WPS, formController, context, callback, alwaysCallback]); }


/**
 * API: SUPS Application Screens invoke this function to start Oracle Report Word Processing(if any)
 * @argument type				type of controller to invoke [ 'CaseManWPCtrl' or 'OracleReportController' (subclasses)
 * @argument formController		formController managing the 'current' form requesting the word processing
 * @argument context		 	xml fragment stating the context for the request
 * @argument callback			callback (function or formname)
 * @argument allwaysCallback 	indicator whether or not to always call the callback, or only after the controller made the appliction navigate away from the 'current' form.
 * @returns 	void
 * @throws  	
 */
WP.ProcessORA = function(formController, context, callback, alwaysCallback) {
	return WP.__DO("OracleReportController", OracleReportController.prototype.process, [ WPS, formController, context, callback, alwaysCallback]); }

/**
 * API: SUPS Application Screens invoke this function to retrieve the process responsible for the current application screen loaded
 * @type WPProcess
 * @returns WPProcess processOnScreen 
 * @throws  	
 */
WP.GetScreenProcess = function() {
	return WP.__DO("CaseManWPCtrl",WPCtrl.prototype.getScreenProcess); }		

/**
 * API: SUPS Application Screens invoke this function to retrieve the process responsible for the current application screen loaded
 * @type WPProcess
 * @returns WPProcess processOnScreen 
 * @throws  	
 */
WP.GetScreenProcessORA = function() {
	return WP.__DO("OracleReportController",WPCtrl.prototype.getScreenProcess); }		
			
/**
 * API: SUPS Application logic (i.e. WPProcess_Step.LoadData.onsuccess) calls this method to record the number for the qa screen
 * @argument headerNumber
 * @argument wpprocess the WPProcess instance for which to set the QA Screen header number
 * @throws  	
 */
WP.SetQA_HeaderNumber = function(headerNumber, wpprocess) {
	return top.WPCtrl.SetQA_HeaderNumber(headerNumber, wpprocess);  }		
		
/**
 * API: SUPS Application logic (i.e. WPProcess_Step.LoadData.onsuccess) calls this method to record the parties for the qa screen
 * @argument headerParties
 * @argument wpprocess the WPProcess instance for which to set the QA Screen header parties
 * @throws  	
 */
WP.SetQA_HeaderParties = function(headerParties, wpprocess) {
	return top.WPCtrl.SetQA_HeaderParties(headerParties, wpprocess); } 
			
/**
 * API: SUPS Application logic (i.e. WPProcess_Step.LoadData.onsuccess) calls this method to set the QA ScreenType
 * @argument screenType ('Case' or 'CO' or 'ORACLEREPORT')
 * @argument wpprocess the WPProcess instance for which to set the QA Screen Type
 * @throws  	
 */
WP.SetQA_ScreenType = function(screenType, wpprocess) {
	return top.WPCtrl.SetQA_ScreenType(screenType, wpprocess); }

/**
 * API: SUPS Application logic (i.e. WPProcess_Step.LoadData.onsuccess) calls this method to record the number for the qa screen
 * @argument wpprocess the WPProcess instance for which to return the QA Header number
 * @returns the QA Screen header (case/co/oraclereport) number
 * @throws  	
 */
WP.GetQA_HeaderNumber = function(wpprocess) {
	return top.WPCtrl.GetQA_HeaderNumber(wpprocess);  }		
		
/**
 * API: SUPS Application logic (i.e. WPProcess_Step.LoadData.onsuccess) calls this method to record the parties for the qa screen
 * @argument wpprocess the WPProcess instance for which to return the QA Header parties
 * @returns the QA Screen header (case/co/oraclereport) parties (Array of Nodes)
 * @throws  	
 */
WP.GetQA_HeaderParties = function(wpprocess) {
	return top.WPCtrl.GetQA_HeaderParties(wpprocess); } 
			
/**
 * API: SUPS Application logic (i.e. WPProcess_Step.LoadData.onsuccess) calls this method to set the QA ScreenType
 * @argument wpprocess the WPProcess instance for which to return the QA Screen Type
 * @returns the QA Screen Type ("Case" or "CO" or "ORACLEREPORT")
 * @throws  	
 */
WP.GetQA_ScreenType = function(wpprocess) {
	return top.WPCtrl.GetQA_ScreenType(wpprocess); }
				
/**
 * API: SUPS Application Screens invoke this function to retrieve the process responsible for the current application screen loaded
 * @type WPProcess
 * @returns WPProcess processOnScreen 
 * @throws  	
 */
WP.GetScreenProcess = function() {
	return WP.__DO("CaseManWPCtrl",WPCtrl.prototype.getScreenProcess); } 		
			
/**
 * API: Returns the host of the SUPS Word Processing Controller, e.g 168.185.27.234:8080
 * @returns the host serving the SUPS Word Processing Controller
 */	
WP.GetHost = function() {		
	return WP.__DO("CaseManWPCtrl",WPCtrl.prototype.getHost); } 		
		
/**
 * API: SUPS Application Screens invoke this methed IF there is a need to get access to the Word Processing Controller Instance
 * Note: As all API is represented by static functions, there should be no 'basic' need to get access to the (singleton) Word Processing Controller (subclass) instance
 * @type WPCtrl
 * @returns The singleton WPCtrl subclass instance
 * @throws  	
 */
WP.GetInstance = function(type) {
	var ctrl = null;
	if ("CaseManWPCtrl" == type) {
		ctrl = top.WP.CaseManWPCtrl; }
	else if("OracleReportController" == type) {
		ctrl = top.WP.OracleReportController; }
	else {
		if (doLog) do_Log("WP API CALL WP.GetInstance("+type+") - incorrect Type."); }
	if (null == ctrl) {
		 if (doLog) do_Log("WP API CALL WP.GetInstance("+type+") returns null - WP not initalized?"); }
	return ctrl; }

/**
 * API: SUPS Application Screens invoke this function to recording a state (value) on a key xphat for an output.
 * @argument WPProcess process
 * @arugment String key - xpath relative to WPCtrl root
 * @argument value - Object value for that key
 * @returns void
 */
WP.SetState = function(process, key, value) {
	var Ctrl = top.WPCtrl;
	if (null != Ctrl) {
		Ctrl.SetState(process, key, value); } }

/**
 * API:
 * @argument stateId
 * @argument value
 * @type boolean
 * @returns boolean indicating whether the state with specified id matches the specified value
 */
WP.CheckState = function(stateId, value) {
	var Ctrl = top.WPCtrl;
	if (null != Ctrl) {
		return Ctrl.CheckState(stateId, value); } }

/**
 * API: SUPS Application Screens invoke this function to retrieve the state (value) (if any) on a key xphat for an output.
 * @type Object
 * @argument WPProcess process
 * @arugment String key - xpath relative to WPCtrl root
 * @returns null or Object
 */
WP.GetState = function(process, key) {
	var Ctrl = top.WPCtrl;
	if (null != Ctrl) {
		return Ctrl.GetState(process, key); } }
	
/**
 * API: 
 * @argument stateKey
 * @returns void
 */
WP.ClearStateKey = function(stateKey) {
	var Ctrl = top.WPCtrl;
	if (null != Ctrl) {
		return Ctrl.ClearStateKey(stateKey); } }

/**
 * API:
 * @returns url pointing at the PDF producer
 */
WP.GetSUPSReportServerURL = function() {
	return WP.__DO("CaseManWPCtrl",WPCtrl.prototype._getSUPSReportServerURL); }

/**
 * API: SUPS Application must invoke this function to shutdown the Word Processing Controller.
 * This typically happens when the application itself is shutdown too.
 * @type boolean
 * @returns boolean indicating successfull shutdown
 * @throws 
 */
WP.ShutDown = function() {
	return WP.__DO("CaseManWPCtrl",WPCtrl.prototype.shutdown); }

/**
 *
 */
WP.FixHTML = function(html) {
	return WP.__DO("CaseManWPCtrl",WPCtrl.prototype._FixHTML, [html]); }
/**

*/
 
WP.FixHTML_DIVONLY = function(xhtml) {
	var node = xhtml.selectSingleNode("//div[@class='EDITME'][1]").cloneNode(true);
	//node.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
	node.setAttribute("xmlns:html","http://www.w3.org/1999/xhtml");
	return node; }

/**
 * API: SUPS Appplications may invoke this method to retrieve a DOM containing an empty context xml.
 * This can then be populated and submitted to WP.Process() API method.
 * Defect/Enhancement: can not use the WP.__DP use with the .getEmptyContextDOM as this WPCtrl
 *	function must be overriden.
 */
WP.GetEmptyContextDOM = function() {
	return top.WP.GetInstance("CaseManWPCtrl").getEmptyContextDOM(); }

/**
 * API:
 * @returns Document DOM with the arguments set in the context so the WPCtrl can do processing.
 */
WP.SetContext = function(dom, arg1, arg2, arg3, arg4, arg5, arg6) {
	dom.selectSingleNode(top.CaseManWPXPath.CaseNumber).appendChild(dom.createTextNode(""+arg1));
	dom.selectSingleNode(top.CaseManWPXPath.EventStandardId).appendChild(dom.createTextNode(""+arg2));
	dom.selectSingleNode(top.CaseManWPXPath.EventPK).appendChild(dom.createTextNode(""+arg3));
	dom.selectSingleNode(top.CaseManWPXPath.Request).appendChild(dom.createTextNode(""+arg4));
	dom.selectSingleNode(top.CaseManWPXPath.FinalFlag).appendChild(dom.createTextNode(""+arg5));
	dom.selectSingleNode(top.CaseManWPXPath.ctxWPOutputId).appendChild(dom.createTextNode(""+arg6));	
	return dom; }
	
/**
 * API:
 * returns Object
 */
WP.GetContextValue = function(ctx, key) {
	var node = ctx.selectSingleNode(key);
	if (null != node) return WPS.getNodeTextContent(node); }	
	
	
/** 
 * WP API used by the integration with the framework editor,
 * to allow the preview button to open up a pdf view of what's currently in the editor (without having it saved)
 */
WP.PreviewOutputInEditor = function() {
	return WP.__DO("CaseManWPCtrl",WPCtrl.prototype._PreviewOutputInEditor, []); }

/** 
 * WP API used by the integration with the framework editor,
 * to allow the print button to print what's currenlty in the editor (without having it saved)
 * Currently implemented only for use by the CaseMan WpCtrl
 */
WP.PrintOutputInEditor = function() {
	return WP.__DO("CaseManWPCtrl", WPCtrl.prototype._PrintOutputInEditor, []); }

/**
 * WP API used by the judgement and obligation screen - in order to make sure that all created events get reported to WP
 * Currently implemented only for use by the CaseMan WpCtrl
 */
WP.CheckForMoreEvents = function(formControllerInstance, dom, wpDom, nextScreen, alwaysCallback) {
	return WP.__DO("CaseManWPCtrl", WPCtrl.prototype._CheckForMoreEvents, [formControllerInstance, dom, wpDom, nextScreen, alwaysCallback]); }

/**
 * Internal function locating the singleton controller instance
 * Defect/Enhancement: this function can not be use with the .getEmptyContextDOM as this WPCtrl
 *						function must be overriden.
 * @argument	ftie	WPCtrl (subclass) instance function to be called
 * @argument	args	Array of the arguments for the instance function
 * @returns		the result of the instance function call
 */
WP.__DO = function(ctrlType, ftie, args) {
	if (doLog)  {	
		var ftieStr = (null != ftie) ? ftie.toString() : "!NULL FUNCTION ERROR!";
		var ftieStrLen = 50 > ftieStr.length ? 50 : ftieStr.length
		var str = "WP.__DO("+ctrlType+", " +ftie.toString().substring(0, ftieStrLen) +", " + args+")";
		//do_Log(str);
		}
	if ("CaseManWPCtrl" == ctrlType || "OracleReportController" == ctrlType) {
		var ctrl = WP.GetInstance(ctrlType);
		if (null != ctrl) {
			if (null != args) {
				return ftie.apply(ctrl, args); } 
			else {
			 return ftie.apply(ctrl); } } }
	else {
		alert("ctrlType = " + ctrlType + ", which is not valid"); } }

/**
 * API: SUPS Application invokes this function to initialize the Word Processing Controller.
 * <pre>This MUST happen only once in the life time of the application - and in the 'top' context.
 * Note: As all API is represented by static functions, there should be no 'basic' need to maintain referenced to the returned (singleton) Word Processing Controller (subclass) instance</pre>
 * @type WPCtrl
 * @argument klass - string name of the specific WPCtrl class to initialise
 * @argument appctrl - instance of the application controller
 * @returns The singleton WPCtrl subclass instance
 * @throws 
 */
WP.InitController = function(klass, appctrl)  {
	var str = "WP.InitController("+klass+","+appctrl.toString()+") ";
	if (doLog) do_Log(str);
	var topWP = top.WP;
	var	__appctrl = appctrl;
	var	__ctrl = null;
	if ("CaseManWPCtrl" == klass) {
		if (null == topWP.CaseManWPCtrl) {
			var str = "__ctrl = new " + klass + "(__appctrl); __appctrl=null;";
			eval(str);
			topWP.CaseManWPCtrl = __ctrl;
			if (doLog) do_Log(str + " instantiated CaseManWPCtrl");	} }
	else if ("OracleReportController" == klass)	{
		if (null == topWP.OracleReportController) {
			var str = "__ctrl = new " + klass + "(__appctrl); __appctrl=null;";
			eval(str);
			topWP.OracleReportController = __ctrl;
			if (doLog) do_Log(str + " instantiated OracleReportController"); } }
	else {
		alert("WP.InitController("+klass+")"); }
	if (doLog) 	{	
		str = str + "returns " + (null != __ctrl) ? __ctrl.toString() : "null";
		do_Log(str); }
	return __ctrl; }	
		
/**
 *
 */
WP.GetURLParameters = function() {
	var args = new Array();
	var paramIndex = document.URL.indexOf('?');
	if(-1 != paramIndex && paramIndex < document.URL.length) {
		var query = document.URL.substring(paramIndex + 1);
		var pairs = query.split("&");
		for(var i = 0; i < pairs.length; i++) {
			var pos = pairs[i].indexOf('=');
			if (pos == -1) continue;
			var argname = pairs[i].substring(0, pos);
			var value = pairs[i].substring(pos + 1);
			args[argname] = unescape(value); } }
	return args; }

/**
 * WP API parsing output-XHTML.xsl output for the editor to render.
 */
WP.SetXhtmlInEditor = function(process, editor) {
    // return WP.__DO("CaseManWPCtrl",WPCtrl.prototype._SetXhtmlInEditor, [html]); }
	var output = process.getOutput();
	var xhtml = WP.GetState(process, WPState.wpl_DOM); 
	var editableDivs = xhtml.selectNodes("//div[@class='EDITME']");
	var noOfEditDivs = editableDivs.length;
	var tableStr = "<table width='930' id='editablesectionstable' style='border: 2px solid blue;'>";
	for (var divIdx=0; divIdx < noOfEditDivs; divIdx++) {
		tableStr += "<tr><td style='background-color: darkgrey; color: blue; padding: 15px 15px 15px 15px;'>"+ output.toString() +" - Editable Section "+(divIdx+1)+"/"+noOfEditDivs+"</td></tr>";
		var divNode = editableDivs[divIdx].cloneNode(true);
		var divIdNode = divNode.selectSingleNode("@id");
		var divId = null;
		if (null != divIdNode) {
			divId = divIdNode.value; }
		tableStr += "<tr><td id='"+divId+"' style='padding: 15px 15px 15px 15px; background-color: white;'>";
		var xhtmlStr = "";
		var child = divNode.firstChild;
		while (child != null) {
			xhtmlStr += child.xml;
			divNode.removeChild(child);
			child = divNode.firstChild;	}
		tableStr += xhtmlStr + "</td></tr>"; }	
	tableStr += "</table>";
	editor.setHTML(tableStr);
    editor.checkEditableIFrame();
    var d = editor.m_editableIframe.contentWindow.document;
    var e = d.createElement("style");
    e.setAttribute("type", "text/css");
    if(e.styleSheet)
    {// IE
        e.styleSheet.cssText = ".SupsFoCursor { }\r\nBODY { background-color: lightgrey;}";
    }
    else
    {// w3c
        var cssText = doc.createTextNode(cssStr);
        e.appendChild(".SupsFoCursor { }\r\nBODY { background-color: lightgrey;}");
    }
    d.getElementsByTagName("HEAD")[0].appendChild(e);
	WP.SetCursorInEditor(editor); }


var theCursorRange = null;
/**
 *
 **/
WP.SetCursorInEditor = function(editor) {
	var cursorId = "SupsFoCursor";
	var editorContentDoc = editor.m_editableIframe.contentWindow.document;
	var editorContentBody = editorContentDoc.body
	var cursorElement = editorContentBody.document.getElementById(cursorId);
	if (null != cursorElement) {
		theCursorRange= editorContentBody.createTextRange();
	    theCursorRange.moveToElementText(cursorElement);
		//range.move('character',-1);
		//range.collapse(); 
		setTimeout("if (null!=theCursorRange) theCursorRange.select();",500);
		
		//var spacer = editorContentBody.document.createTextNode(" ");
		//cursorElement.parentElement.insertBefore(spacer, cursorElement);
		//var cursorChild = cursorElement.firstChild;
		//while (null != cursorChild) {
		//	cursorElement.removeChild(cursorChild);
		//	cursorChild = cursorElement.firstChild; }
		//cursorElement.parentElement.removeChild(cursorElement);
		//range.move('character',2); 
	} }
		

/**
 * @returns boolean - indicating whether or not to continue with the save.
 * false means do not continue saving cause the user wants/needs to move text.
 * when there is no table found - true will be returned - this function does not chekck the content of the editable stuff 
 */
WP.RemoveTextOutsideEditableSectionsTable = function(editor) {
	var tableId = "editablesectionstable";
	var editorContentDoc = editor.m_editableIframe.contentWindow.document;
	var editorContentBody = editorContentDoc.body
	var tableElement = editorContentBody.document.getElementById(tableId);
	if (null != tableElement) {
		var par = tableElement.parentNode;
		var children = par.childNodes;
		var len = children.length;
		var xtr = false;
		for (var i=0; i < len; i++) {
			var child = children[i];
			if (tableElement != child && "STYLE" != child.tagName && child._fckxhtmljob != undefined)
            {
				xtr = true;
                break;
            }
        }
    } 
	

	if (true == xtr) {
		var doRemove = doRemove = confirm("All text/content outside the 'editable section table' will be removed. \n\n Click 'OK' to continue or 'Cancel' to edit again."); 
		if (doRemove) 
		{
			child = children[0];
			var ready = false;
			while (null != child && !ready) {
				var tName = child.tagName;
				var nextChild = child.nextSibling;
				if ("TABLE" != tName && "STYLE" != tName) {
					par.removeChild(child);	}
				child = nextChild; } 
			return true;
		}						
		else
		{
			return false;
		}
	}	
	return true;
}
	

/**
 * Deprecated API:SUPS Application invokes this function to initialize the Word Processing Controller.
 * This MUST happen only once in the life time of the application - and in the 'top' context.
 * @see #WP, #CaseManWPCtrl
 * @argument klass - string name of the specific WPCtrl class to initialise
 * @argument appctrl - instance of the application controller
 * @deprecated
 * @type WPCtrl
 * @returns a WPCtrl subclass instance
 */
function initWPController(klass, appctrl) {
	if (!top.InitPrintintSwitchesDone) InitPrintintSwitches()
	if (!top.InitDebugLogSwitchesDone) InitDebugLogSwitches()
	return WP.InitController(klass, appctrl); }