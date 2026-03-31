/** 
 * @fileoverview AuditIncludeFiles.js:
 * This file includes the common css, JavaScript in the header tag of screens
 * making use of Audit.
 *
 * @author Chris Vincent
 * @version 0.1
 */

/**
 * Adds a JavaScript tag to the head tag with the path passed in
 * @param {String} jsPath Relative path to the JavaScript File
 * @author rzxd7g
 * 
 */
function includeJS(jsPath)
{
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", jsPath);
	document.getElementsByTagName("head")[0].appendChild(script);
}

includeJS("../../AuditPanelGUIAdaptor.js");
includeJS("../../AuditSelectorGUIAdaptor.js");
includeJS("../../AuditSelectorRenderer.js");
