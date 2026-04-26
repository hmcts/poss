/** 
 * @fileoverview CaseManIncludeFiles.js:
 * This file includes the common css, JavaScript in the header tag as well as any
 * meta tags common to any screens.
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * Changes:
 * 06/06/2006 - Chris Vincent, changed includeCss function so uses the absolute 
 *				url of the stylesheet instead of a relative path which doesn't
 *				work for subforms.
 */

/**
 * Adds meta tags to the head tag although at present only one meta tag is required
 * May have to paramaterise if more meta tags are required.
 * @author kznwpr
 * 
 */
function includeMeta()
{
	var meta = document.createElement("meta");
	meta.setAttribute("http-equiv", "charset");
	meta.setAttribute("content", "UTF8");
	document.getElementsByTagName("head")[0].appendChild(meta);
}

/**
 * Adds a css tag to the head tag with the path passed in
 * @param {String} cssPath Relative path to the CSS File
 * @author kznwpr
 * 
 */
function includeCSS(cssPath)
{
	var ac = Services.getAppController();
	var url = ac.getRootURL() + ac.m_config.getAppBaseURL() + cssPath;
	
	var css = document.createElement("link");
	css.setAttribute("type", "text/css");
	css.setAttribute("rel", "stylesheet");
	css.setAttribute("href", url);
	document.getElementsByTagName("head")[0].appendChild(css);
}

includeMeta();
includeCSS("/screens/CaseManStyleSheet.css");
