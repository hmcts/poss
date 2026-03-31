/**  
 * @fileoverview CaseManIncludeFiles.js:
 * This file includes the common css, JavaScript in the header tag as well as any
 * meta tags common to any screens.
 */
/**
 * Adds meta tags to the head tag although at present only one meta tag is required
 * May have to paramaterise if more meta tags are required.
 * @author nz5zpz
 * 
 */
function includeMeta() {
	var meta = document.createElement("meta");
	meta.setAttribute("http-equiv", "charset");
	meta.setAttribute("content", "UTF8");
	document.getElementsByTagName("head")[0].appendChild(meta); }

/**
 * Adds a css tag to the head tag with the path passed in
 * @param {String} cssPath Relative path to the CSS File
 * @author nz5zpz
 * 
 */
function includeCSS(cssPath) {
	var css = document.createElement("link");
	css.setAttribute("type", "text/css");
	css.setAttribute("rel", "stylesheet");
	css.setAttribute("href", cssPath);
	document.getElementsByTagName("head")[0].appendChild(css); }

/**
 * Adds a JavaScript tag to the head tag with the path passed in
 * @param {String} jsPath Relative path to the JavaScript File
 * @author nz5zpz
 * 
 */
function includeJS(jsPath) {
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", jsPath);
	document.getElementsByTagName("head")[0].appendChild(script); }

includeMeta();
includeCSS("../../../../screens/CaseManStyleSheet.css");
includeJS("../../../../CaseManValidationHelper.js");
includeJS("../../../../CaseManUtils.js");
includeJS("../../../../CaseManFormParameters.js");
includeJS("../../../../NavigationController.js");
includeJS("../../../../Messages.js");
includeJS("../../../../PartyTypeCodes.js");
includeJS("../../../../ReportUtils.js");
includeJS("../../../../SuperLogicGUIAdaptor.js");
includeJS("../../../../ExitScreenGUIAdaptor.js");
