/**
 * CaseMan Word Processing Controller
 * <pre>The SUPS CaseMan application uses the Word Processing controller to delegate all word processing to.
 * This way, no 'core' application developers need to know of any word processing 'specifics'.
 * Note: DO NOT instantiate by new CaseManWPCtrl() - rather see WP.InitController</pre>
 * @see #WP, #WPCtrl
 * @constructor
 * @returns the CaseMan Word Processing (singleton) instance.
 *
 * Change History
 *	
 * June 18, 2012 Des Johnston - Trac 3273 - change to fixEntity 
 */

function CaseManWPCtrl(appCtrl) 
{
	WPCtrl.apply(this, [appCtrl]);
	if (doLog) do_Log(this + " finished constructor"); 
}

/**
 * CaseMan Word Processing Controller super class
 */
CaseManWPCtrl.prototype = new WPCtrl();

/**
 * CaseMan Word Processing Controller constructor
 */
CaseManWPCtrl.prototype.constructor = CaseManWPCtrl;

/**
 * CaseMan Word Processing Controller toString function.
 * @returns String representation of this controller instance.
 */
CaseManWPCtrl.prototype.toString = function() 
{
	return "CaseManWPCtrl"; 
}
/**
 * overriding the wpctrl method
 */
CaseManWPCtrl.prototype.process = function(WPS, formctrl, context, callback, alwaysCallback) {
	var sxml = "";
	try	{ sxml = context.xml; }
	catch(err) { }
	if (doLog) do_Log(this + ".process("+formctrl+", "+sxml+", "+callback+", "+alwaysCallback+")");
	var processArray = this.processFindRequests(formctrl, context, callback, alwaysCallback);
	var noOfPro = processArray.length;
	for (var i=0; i < noOfPro; i++)
	{
		var process = processArray[i];
		if (doLog) do_Log(this + ".process(...) to add to processQ: "+process.toString());
		this.addProcessToQ(process, true); 
	}
	return processArray; }
/**
 * CaseMan Word Processing Controller identifyRequest function 
 * <pre>Analyzes the contextxml and returning the appropriate process to run or null;
 * This function overrides the superclass' function!</pre>
 * @type WPRequest
 * @argument formctrl			form controller
 * @argument context			xml fragment stating the context for the request
 * @argument cb		callback
 * @argument acb	always callback
 * @returns WPRequest or null
 * @deprecated
 */
CaseManWPCtrl.prototype.identifyProcess = function(formctrl, context, cb, acb) {
	 var pro = null;
	 if (null != context) {
	 	pro = WPProcess.FindProcessFor(this, context, cb, acb); }
	 return pro; }


/**
 * CaseMan Word Processing Controller identifyRequest function 
 * <pre>Analyzes the contextxml and returning the appropriate process to run or null;
 * This function overrides the superclass' function!</pre>
 * @type WPRequest
 * @argument formctrl			form controller
 * @argument context			xml fragment stating the context for the request
 * @argument cb		callback
 * @argument acb	always callback
 * @returns WPRequest or null
 */
CaseManWPCtrl.prototype.identifyProcesses = function(formctrl, context, cb, acb) {
	
	 var pros = null;
	 if (null != context) {
	 	pros = WPProcess.FindProcessesFor(this, context, cb, acb); } 	
	 return pros; }

/**
 * CaseMan Word Processing Controller intitialisation function
 * @returns	void
 * @throws  new Error(WPCtrlErr.____1)
 */
CaseManWPCtrl.prototype.initialize = function() {
	if (doLog) {
		do_Log(this + " initialize() starts ");
		do_Log(this + " initialize() loading from " +this.getControllerConfigXMLUrl()+"..."); }
	var dom = WPS.loadDOMFromURL(this.getControllerConfigXMLUrl());
	if (doLog) do_Log(this + " initialize() loading from " +this.getControllerConfigXMLUrl()+"... Complete, success=" +s);
	this.configxml = dom;
	var s = (null != dom.selectSingleNode("/configuration"));
	if (!s) throw new Error(WPCtrlErr.____3);	
	s = this.initializeXPaths("CaseManWPXPath");
	if (!s) throw new Error(WPCtrlErr.____4);	
	s = this.initializeProcess("CaseManWPProcess");
	if (!s) throw new Error(WPCtrlErr.____5);	
	if (doLog) do_Log(this + " initialize() ends"); 
}

/**
 * CaseMan Word Processing Controller function
 * This function overrides the WPCtrl function
 * @deprecated
 * @returns String representation of the sups client application url
 */
CaseManWPCtrl.prototype.getClientAppUrl = function() {
	alert("FATAL ERROR: .getClientAppUrl()  in use!")
	return "/caseman"; }

/**
 * SUPS Word Procesing Controller function returning the url pointing at CaseMan WPController's configuration xml
 * This function overrides the WPCtrl abstract function!
 * @returns String representation of the url hosting the CaseMan WPController's configuration xml
 */
CaseManWPCtrl.prototype.getControllerConfigXMLUrl = function() {
	return "../caseman_wp/generated/gen_wpctrl.xml"; }

/**
 * CaseMan Word Processing Controller function
 * This function overrides the WPCtrl function
 * @returns String representation of the sups server application url
 */
CaseManWPCtrl.prototype.getServerAppUrl = function() {
	return "http://" + WP.GetHost() + "/casemanwp"; }

/**
 * SUPS Word Processing Controller function returning the URL pointing at the
 * root of the SUPS Word Processing Report Server.
 * @type String
 * @returns the url pointing at the SUPS WP Report Server
 */
CaseManWPCtrl.prototype.getSUPSReportServerURL = function () {
	 return this.getServerAppUrl() + "/servicenoticeofissuefop"; }
	 
/**
 * CaseMan Word Procesing Controller function
 * This function overrides the WPCtrl function
 * @returns String represenation of the xpath pointing at WP data in the application's DOM.
 */
CaseManWPCtrl.prototype.getBaseXPath = function() {
	return "/ds/app/var/wp/";  }
	
/**
 * CaseMan Word Processing Controller getEmptyContextDOM function return an context xml DOM to be completed,
 * and submitted in the WP.Process() API
 * @type Document
 * @returns empty context DOM
 */
CaseManWPCtrl.prototype.getEmptyContextDOM = function() {
	if (null != CaseManWPXPath.NEW_contextXML) return CaseManWPXPath.NEW_contextXML.cloneNode(true);
	return CaseManWPXPath.NEW_contextXML; }
	
/**
 * CaseMan Word Processing Controller - fix HTML to XHTML
 * @argument html	html string
 * @type String
 * @returns xhtml string version of the html string
 */
CaseManWPCtrl.prototype.FixHTML = function(html) {
	var html1 = null == html ? "" : html;
	if (doLog) do_Log("CaseManWPCtrl.prototype.FixHTML starts"); 
	html1 = this._fixEntities(html1);
		if (doLog) do_Log("CaseManWPCtrl.prototype.FixHTML - Fixed Entities"); 	
	html1 = this._ensureNOFO(html1);
		if (doLog) do_Log("CaseManWPCtrl.prototype.FixHTML - Fixed FO - END OF FixHTML()."); 	
	return html1; }
	


/**
 * CaseMan Word Processing Controller - fix HTML to XHTML - ensure any remaining fo's are now xhtmls
  */
CaseManWPCtrl.prototype._ensureNOFO = function(x) {
	var y = this._fixEntity(x, "fo:inline", "span");
	y = this._fixEntity(x, "<inline", "<span"); // Amended for trac 3273
	return y; }

/**
 * CaseMan Word Processing Controller - fix HTML to XHTML - all entities replacement function
 */
CaseManWPCtrl.prototype._fixEntities = function(x) {
	var y = x;
	y = this._fixEntity(y, "&nbsp;" ,  "&#160;"); /** no-break space = non-breaking space, U+00A0 ISOnum **/
	y = this._fixEntity(y, "&iexcl;",  "&#161;");  /** inverted exclamation mark, U+00A1 ISOnum **/
	y = this._fixEntity(y, "&cent;",   "&#162;");  /** cent sign, U+00A2 ISOnum **/
	y = this._fixEntity(y, "&pound;",  "&#163;");  /** pound sign, U+00A3 ISOnum **/
	y = this._fixEntity(y, "&curren;", "&#164;");  /** currency sign, U+00A4 ISOnum **/
	y = this._fixEntity(y, "&yen;",    "&#165;");  /** yen sign = yuan sign, U+00A5 ISOnum **/
	y = this._fixEntity(y, "&brvbar;", "&#166;");  /** broken bar = broken vertical bar,U+00A6 ISOnum **/
	y = this._fixEntity(y, "&sect;",   "&#167;"); /** section sign, U+00A7 ISOnum **/
	y = this._fixEntity(y, "&uml;",    "&#168;"); /** diaeresis = spacing diaeresis,U+00A8 ISOdia **/
	y = this._fixEntity(y, "&copy;",   "&#169;"); /** copyright sign, U+00A9 ISOnum **/
	y = this._fixEntity(y, "&ordf;",   "&#170;"); /** feminine ordinal indicator, U+00AA ISOnum **/
	y = this._fixEntity(y, "&laquo;",  "&#171;"); /** left-pointing double angle quotation mark= left pointing guillemet, U+00AB ISOnum **/
	y = this._fixEntity(y, "&not;",    "&#172;"); /** not sign = angled dash,U+00AC ISOnum **/
	y = this._fixEntity(y, "&shy;",    "&#173;"); /** soft hyphen = discretionary hyphen,U+00AD ISOnum **/
	y = this._fixEntity(y, "&reg;",    "&#174;"); /** registered sign = registered trade mark sign,U+00AE ISOnum **/
	y = this._fixEntity(y, "&macr;",   "&#175;"); /** macron = spacing macron = overline= APL overbar, U+00AF ISOdia **/
	y = this._fixEntity(y, "&deg;",    "&#176;"); /** degree sign, U+00B0 ISOnum **/
	y = this._fixEntity(y, "&plusmn;", "&#177;"); /** plus-minus sign = plus-or-minus sign,U+00B1 ISOnum **/
	y = this._fixEntity(y, "&sup2;",   "&#178;"); /** superscript two = superscript digit two= squared, U+00B2 ISOnum **/
	y = this._fixEntity(y, "&sup3;",   "&#179;"); /** superscript three = superscript digit three= cubed, U+00B3 ISOnum **/
	y = this._fixEntity(y, "&acute;",  "&#180;"); /** acute accent = spacing acute,U+00B4 ISOdia **/
	y = this._fixEntity(y, "&micro;",  "&#181;"); /** micro sign, U+00B5 ISOnum **/
	y = this._fixEntity(y, "&para;",   "&#182;"); /** pilcrow sign = paragraph sign,U+00B6 ISOnum **/
	y = this._fixEntity(y, "&middot;", "&#183;"); /** middle dot = Georgian comma= Greek middle dot, U+00B7 ISOnum **/
	y = this._fixEntity(y, "&cedil;",  "&#184;"); /** cedilla = spacing cedilla, U+00B8 ISOdia **/
	y = this._fixEntity(y, "&sup1;",   "&#185;"); /** superscript one = superscript digit one,U+00B9 ISOnum **/
	y = this._fixEntity(y, "&ordm;",   "&#186;"); /** masculine ordinal indicator,U+00BA ISOnum **/
	y = this._fixEntity(y, "&raquo;",  "&#187;"); /** right-pointing double angle quotation mark= right pointing guillemet, U+00BB ISOnum **/
	y = this._fixEntity(y, "&frac14;", "&#188;"); /** vulgar fraction one quarter= fraction one quarter, U+00BC ISOnum **/
	y = this._fixEntity(y, "&frac12;", "&#189;"); /** vulgar fraction one half= fraction one half, U+00BD ISOnum **/
	y = this._fixEntity(y, "&frac34;", "&#190;"); /** vulgar fraction three quarters= fraction three quarters, U+00BE ISOnum **/
	y = this._fixEntity(y, "&iquest;", "&#191;"); /** inverted question mark= turned question mark, U+00BF ISOnum **/
	y = this._fixEntity(y, "&Agrave;", "&#192;"); /** latin capital letter A with grave= latin capital letter A grave,U+00C0 ISOlat1 **/
	y = this._fixEntity(y, "&Aacute;", "&#193;"); /** latin capital letter A with acute,U+00C1 ISOlat1 **/
	y = this._fixEntity(y, "&Acirc;",  "&#194;"); /** latin capital letter A with circumflex,U+00C2 ISOlat1 **/
	y = this._fixEntity(y, "&Atilde;", "&#195;"); /** latin capital letter A with tilde,U+00C3 ISOlat1 **/
	y = this._fixEntity(y, "&Auml;",   "&#196;"); /** latin capital letter A with diaeresis,U+00C4 ISOlat1 **/
	y = this._fixEntity(y, "&Aring;",  "&#197;"); /** latin capital letter A with ring above= latin capital letter A ring,U+00C5 ISOlat1 **/
	y = this._fixEntity(y, "&AElig;",  "&#198;"); /** latin capital letter AE= latin capital ligature AE,U+00C6 ISOlat1 **/
	y = this._fixEntity(y, "&Ccedil;", "&#199;"); /** latin capital letter C with cedilla,U+00C7 ISOlat1 **/
	y = this._fixEntity(y, "&Egrave;", "&#200;"); /** latin capital letter E with grave,U+00C8 ISOlat1 **/
	y = this._fixEntity(y, "&Eacute;", "&#201;"); /** latin capital letter E with acute,U+00C9 ISOlat1 **/
	y = this._fixEntity(y, "&Ecirc;",  "&#202;"); /** latin capital letter E with circumflex,U+00CA ISOlat1 **/
	y = this._fixEntity(y, "&Euml;",   "&#203;"); /** latin capital letter E with diaeresis,U+00CB ISOlat1 **/
	y = this._fixEntity(y, "&Igrave;", "&#204;"); /** latin capital letter I with grave,U+00CC ISOlat1 **/
	y = this._fixEntity(y, "&Iacute;", "&#205;"); /** latin capital letter I with acute,U+00CD ISOlat1 **/
	y = this._fixEntity(y, "&Icirc;",  "&#206;"); /** latin capital letter I with circumflex,U+00CE ISOlat1 **/
	y = this._fixEntity(y, "&Iuml;",   "&#207;"); /** latin capital letter I with diaeresis,U+00CF ISOlat1 **/
	y = this._fixEntity(y, "&ETH;",    "&#208;"); /** latin capital letter ETH, U+00D0 ISOlat1 **/
	y = this._fixEntity(y, "&Ntilde;", "&#209;"); /** latin capital letter N with tilde,U+00D1 ISOlat1 **/
	y = this._fixEntity(y, "&Ograve;", "&#210;"); /** latin capital letter O with grave,U+00D2 ISOlat1 **/
	y = this._fixEntity(y, "&Oacute;", "&#211;"); /** latin capital letter O with acute,U+00D3 ISOlat1 **/
	y = this._fixEntity(y, "&Ocirc;",  "&#212;"); /** latin capital letter O with circumflex,U+00D4 ISOlat1 **/
	y = this._fixEntity(y, "&Otilde;", "&#213;"); /** latin capital letter O with tilde,U+00D5 ISOlat1 **/
	y = this._fixEntity(y, "&Ouml;",   "&#214;"); /** latin capital letter O with diaeresis,U+00D6 ISOlat1 **/
	y = this._fixEntity(y, "&times;",  "&#215;"); /** multiplication sign, U+00D7 ISOnum **/
	y = this._fixEntity(y, "&Oslash;", "&#216;"); /** latin capital letter O with stroke= latin capital letter O slash,U+00D8 ISOlat1 **/
	y = this._fixEntity(y, "&Ugrave;", "&#217;"); /** latin capital letter U with grave,U+00D9 ISOlat1 **/
	y = this._fixEntity(y, "&Uacute;", "&#218;"); /** latin capital letter U with acute,U+00DA ISOlat1 **/
	y = this._fixEntity(y, "&Ucirc;",  "&#219;"); /** latin capital letter U with circumflex,U+00DB ISOlat1 **/
	y = this._fixEntity(y, "&Uuml;",   "&#220;"); /** latin capital letter U with diaeresis,U+00DC ISOlat1 **/
	y = this._fixEntity(y, "&Yacute;", "&#221;"); /** latin capital letter Y with acute,U+00DD ISOlat1 **/
	y = this._fixEntity(y, "&THORN;",  "&#222;"); /** latin capital letter THORN,U+00DE ISOlat1 **/
	y = this._fixEntity(y, "&szlig;",  "&#223;"); /** latin small letter sharp s = ess-zed,U+00DF ISOlat1 **/
	y = this._fixEntity(y, "&agrave;", "&#224;"); /** latin small letter a with grave= latin small letter a grave,U+00E0 ISOlat1 **/
	y = this._fixEntity(y, "&aacute;", "&#225;"); /** latin small letter a with acute,U+00E1 ISOlat1 **/
	y = this._fixEntity(y, "&acirc;",  "&#226;"); /** latin small letter a with circumflex,U+00E2 ISOlat1 **/
	y = this._fixEntity(y, "&atilde;", "&#227;"); /** latin small letter a with tilde,U+00E3 ISOlat1 **/
	y = this._fixEntity(y, "&auml;",   "&#228;"); /** latin small letter a with diaeresis,U+00E4 ISOlat1 **/
	y = this._fixEntity(y, "&aring;",  "&#229;"); /** latin small letter a with ring above= latin small letter a ring,U+00E5 ISOlat1 **/
	y = this._fixEntity(y, "&aelig;",  "&#230;"); /** latin small letter ae= latin small ligature ae, U+00E6 ISOlat1 **/
	y = this._fixEntity(y, "&ccedil;", "&#231;"); /** latin small letter c with cedilla,U+00E7 ISOlat1 **/
	y = this._fixEntity(y, "&egrave;", "&#232;"); /** latin small letter e with grave,U+00E8 ISOlat1 **/
	y = this._fixEntity(y, "&eacute;", "&#233;"); /** latin small letter e with acute,U+00E9 ISOlat1 **/
	y = this._fixEntity(y, "&ecirc;",  "&#234;"); /** latin small letter e with circumflex,U+00EA ISOlat1 **/
	y = this._fixEntity(y, "&euml;",   "&#235;"); /** latin small letter e with diaeresis,U+00EB ISOlat1 **/
	y = this._fixEntity(y, "&igrave;", "&#236;"); /** latin small letter i with grave,U+00EC ISOlat1 **/
	y = this._fixEntity(y, "&iacute;", "&#237;"); /** latin small letter i with acute,U+00ED ISOlat1 **/
	y = this._fixEntity(y, "&icirc;",  "&#238;"); /** latin small letter i with circumflex,U+00EE ISOlat1 **/
	y = this._fixEntity(y, "&iuml;",   "&#239;"); /** latin small letter i with diaeresis,U+00EF ISOlat1 **/
	y = this._fixEntity(y, "&eth;",    "&#240;"); /** latin small letter eth, U+00F0 ISOlat1 **/
	y = this._fixEntity(y, "&ntilde;", "&#241;"); /** latin small letter n with tilde,U+00F1 ISOlat1 **/
	y = this._fixEntity(y, "&ograve;", "&#242;"); /** latin small letter o with grave,U+00F2 ISOlat1 **/
	y = this._fixEntity(y, "&oacute;", "&#243;"); /** latin small letter o with acute,U+00F3 ISOlat1 **/
	y = this._fixEntity(y, "&ocirc;",  "&#244;"); /** latin small letter o with circumflex,U+00F4 ISOlat1 **/
	y = this._fixEntity(y, "&otilde;", "&#245;"); /** latin small letter o with tilde,U+00F5 ISOlat1 **/
	y = this._fixEntity(y, "&ouml;",   "&#246;"); /** latin small letter o with diaeresis,U+00F6 ISOlat1 **/
	y = this._fixEntity(y, "&divide;", "&#247;"); /** division sign, U+00F7 ISOnum **/
	y = this._fixEntity(y, "&oslash;", "&#248;"); /** latin small letter o with stroke,= latin small letter o slash,U+00F8 ISOlat1 **/
	y = this._fixEntity(y, "&ugrave;", "&#249;"); /** latin small letter u with grave,U+00F9 ISOlat1 **/
	y = this._fixEntity(y, "&uacute;", "&#250;"); /** latin small letter u with acute,U+00FA ISOlat1 **/
	y = this._fixEntity(y, "&ucirc;",  "&#251;"); /** latin small letter u with circumflex,U+00FB ISOlat1 **/
	y = this._fixEntity(y, "&uuml;",   "&#252;"); /** latin small letter u with diaeresis,U+00FC ISOlat1 **/
	y = this._fixEntity(y, "&yacute;", "&#253;"); /** latin small letter y with acute,U+00FD ISOlat1 **/
	y = this._fixEntity(y, "&thorn;",  "&#254;"); /** latin small letter thorn,U+00FE ISOlat1 **/
	y = this._fixEntity(y, "&yuml;",   "&#255;"); /** latin small letter y with diaeresis,U+00FF ISOlat1 **/
/** Special characters for XHTML **/

/** Character entity set. Typical invocation:
     <!ENTITY % HTMLspecial PUBLIC
        "-//W3C//ENTITIES Special for XHTML//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml-special.ent">
     %HTMLspecial;
**/

/** Portions (C) International Organization for Standardization 1986:
     Permission to copy in any form is granted for use with
     conforming SGML systems and applications as defined in
     ISO 8879, provided this notice is included in all copies.
**/

/** Relevant ISO entity set is given unless names are newly introduced.
     New names (i.e., not in ISO 8879 list) do not clash with any
     existing ISO 8879 entity names. ISO 10646 character numbers
     are given for each character, in hex. values are decimal
     conversions of the ISO 10646 values and refer to the document
     character set. Names are Unicode names. 
**/

/** C0 Controls and Basic Latin **/
	y = this._fixEntity(y, "&quot;",    "&#34;"); /**  quotation mark, U+0022 ISOnum **/
	y = this._fixEntity(y, "&amp;",     "&#38;"); /**  ampersand, U+0026 ISOnum **/
	y = this._fixEntity(y, "&lt;",      "&#60;"); /**  less-than sign, U+003C ISOnum **/
	y = this._fixEntity(y, "&gt;",      "&#62;"); /**  greater-than sign, U+003E ISOnum **/
	y = this._fixEntity(y, "&apos;",     "&#39;"); /**  apostrophe = APL quote, U+0027 ISOnum **/

/** Latin Extended-A **/
	y = this._fixEntity(y, "&OElig;",   "&#338;"); /**  latin capital ligature OE,U+0152 ISOlat2 **/
	y = this._fixEntity(y, "&oelig;",   "&#339;"); /**  latin small ligature oe, U+0153 ISOlat2 **/
/** ligature is a misnomer, this is a separate character in some languages **/
	y = this._fixEntity(y, "&Scaron;",  "&#352;"); /**  latin capital letter S with caron,U+0160 ISOlat2 **/
	y = this._fixEntity(y, "&scaron;",  "&#353;"); /**  latin small letter s with caron,U+0161 ISOlat2 **/
	y = this._fixEntity(y, "&Yuml;",    "&#376;"); /**  latin capital letter Y with diaeresis,U+0178 ISOlat2 **/

/** Spacing Modifier Letters **/
	y = this._fixEntity(y, "&circ;",    "&#710;"); /**  modifier letter circumflex accent,U+02C6 ISOpub **/
	y = this._fixEntity(y, "&tilde;",   "&#732;"); /**  small tilde, U+02DC ISOdia **/

/** General Punctuation **/
	y = this._fixEntity(y, "&ensp;",    "&#8194;"); /** en space, U+2002 ISOpub **/
	y = this._fixEntity(y, "&emsp;",    "&#8195;"); /** em space, U+2003 ISOpub **/
	y = this._fixEntity(y, "&thinsp;",  "&#8201;"); /** thin space, U+2009 ISOpub **/
	y = this._fixEntity(y, "&zwnj;",    "&#8204;"); /** zero width non-joiner,U+200C NEW RFC 2070 **/
	y = this._fixEntity(y, "&zwj;",     "&#8205;"); /** zero width joiner, U+200D NEW RFC 2070 **/
	y = this._fixEntity(y, "&lrm;",     "&#8206;"); /** left-to-right mark, U+200E NEW RFC 2070 **/
	y = this._fixEntity(y, "&rlm;",     "&#8207;"); /** right-to-left mark, U+200F NEW RFC 2070 **/
	y = this._fixEntity(y, "&ndash;",   "&#8211;"); /** en dash, U+2013 ISOpub **/
	y = this._fixEntity(y, "&mdash;",   "&#8212;"); /** em dash, U+2014 ISOpub **/
	y = this._fixEntity(y, "&lsquo;",   "&#8216;"); /** left single quotation mark,U+2018 ISOnum **/
	y = this._fixEntity(y, "&rsquo;",   "&#8217;"); /** right single quotation mark,U+2019 ISOnum **/
	y = this._fixEntity(y, "&sbquo;",   "&#8218;"); /** single low-9 quotation mark, U+201A NEW **/
	y = this._fixEntity(y, "&ldquo;",   "&#8220;"); /** left double quotation mark,U+201C ISOnum **/
	y = this._fixEntity(y, "&rdquo;",   "&#8221;"); /** right double quotation mark,U+201D ISOnum **/
	y = this._fixEntity(y, "&bdquo;",   "&#8222;"); /** double low-9 quotation mark, U+201E NEW **/
	y = this._fixEntity(y, "&dagger;",  "&#8224;"); /** dagger, U+2020 ISOpub **/
	y = this._fixEntity(y, "&Dagger;",  "&#8225;"); /** double dagger, U+2021 ISOpub **/
	y = this._fixEntity(y, "&permil;",  "&#8240;"); /** per mille sign, U+2030 ISOtech **/
	y = this._fixEntity(y, "&lsaquo;",  "&#8249;"); /** single left-pointing angle quotation mark,U+2039 ISO proposed **/
/** lsaquo is proposed but not yet ISO standardized **/
	y = this._fixEntity(y, "&rsaquo;",  "&#8250;"); /** single right-pointing angle quotation mark,U+203A ISO proposed **/
/** rsaquo is proposed but not yet ISO standardized **/

/** Currency Symbols **/
	y = this._fixEntity(y, "&euro;",   "&#8364;"); /**  euro sign, U+20AC NEW **/
/** Mathematical, Greek and Symbolic characters for XHTML **/

/** Character entity set. Typical invocation:
     <!ENTITY % HTMLsymbol PUBLIC
        "-//W3C//ENTITIES Symbols for XHTML//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml-symbol.ent">
     %HTMLsymbol;
**/

/** Portions (C) International Organization for Standardization 1986:
     Permission to copy in any form is granted for use with
     conforming SGML systems and applications as defined in
     ISO 8879, provided this notice is included in all copies.
**/

/** Relevant ISO entity set is given unless names are newly introduced.
     New names (i.e., not in ISO 8879 list) do not clash with any
     existing ISO 8879 entity names. ISO 10646 character numbers
     are given for each character, in hex. values are decimal
     conversions of the ISO 10646 values and refer to the document
     character set. Names are Unicode names. 
**/

/** Latin Extended-B **/
	y = this._fixEntity(y, "&fnof;",     "&#402;"); /** latin small letter f with hook = function
                                    = florin, U+0192 ISOtech **/

/** Greek **/
	y = this._fixEntity(y, "&Alpha;",    "&#913;"); /** greek capital letter alpha, U+0391 **/
	y = this._fixEntity(y, "&Beta;",     "&#914;"); /** greek capital letter beta, U+0392 **/
	y = this._fixEntity(y, "&Gamma;",    "&#915;"); /** greek capital letter gamma,U+0393 ISOgrk3 **/
	y = this._fixEntity(y, "&Delta;",    "&#916;"); /** greek capital letter delta,U+0394 ISOgrk3 **/
	y = this._fixEntity(y, "&Epsilon;",  "&#917;"); /** greek capital letter epsilon, U+0395 **/
	y = this._fixEntity(y, "&Zeta;",     "&#918;"); /** greek capital letter zeta, U+0396 **/
	y = this._fixEntity(y, "&Eta;",      "&#919;"); /** greek capital letter eta, U+0397 **/
	y = this._fixEntity(y, "&Theta;",    "&#920;"); /** greek capital letter theta,U+0398 ISOgrk3 **/
	y = this._fixEntity(y, "&Iota;",     "&#921;"); /** greek capital letter iota, U+0399 **/
	y = this._fixEntity(y, "&Kappa;",    "&#922;"); /** greek capital letter kappa, U+039A **/
	y = this._fixEntity(y, "&Lambda;",   "&#923;"); /** greek capital letter lamda,U+039B ISOgrk3 **/
	y = this._fixEntity(y, "&Mu;",       "&#924;"); /** greek capital letter mu, U+039C **/
	y = this._fixEntity(y, "&Nu;",       "&#925;"); /** greek capital letter nu, U+039D **/
	y = this._fixEntity(y, "&Xi;",       "&#926;"); /** greek capital letter xi, U+039E ISOgrk3 **/
	y = this._fixEntity(y, "&Omicron;",  "&#927;"); /** greek capital letter omicron, U+039F **/
	y = this._fixEntity(y, "&Pi;",       "&#928;"); /** greek capital letter pi, U+03A0 ISOgrk3 **/
	y = this._fixEntity(y, "&Rho;",      "&#929;"); /** greek capital letter rho, U+03A1 **/
/** there is no Sigmaf, and no U+03A2 character either **/
	y = this._fixEntity(y, "&Sigma;",    "&#931;"); /** greek capital letter sigma,U+03A3 ISOgrk3 **/
	y = this._fixEntity(y, "&Tau;",      "&#932;"); /** greek capital letter tau, U+03A4 **/
	y = this._fixEntity(y, "&Upsilon;",  "&#933;"); /** greek capital letter upsilon,U+03A5 ISOgrk3 **/
	y = this._fixEntity(y, "&Phi;",      "&#934;"); /** greek capital letter phi,U+03A6 ISOgrk3 **/
	y = this._fixEntity(y, "&Chi;",      "&#935;"); /** greek capital letter chi, U+03A7 **/
	y = this._fixEntity(y, "&Psi;",      "&#936;"); /** greek capital letter psi,U+03A8 ISOgrk3 **/
	y = this._fixEntity(y, "&Omega;",    "&#937;"); /** greek capital letter omega,U+03A9 ISOgrk3 **/
	y = this._fixEntity(y, "&alpha;",    "&#945;"); /** greek small letter alpha,U+03B1 ISOgrk3 **/
	y = this._fixEntity(y, "&beta;",     "&#946;"); /** greek small letter beta, U+03B2 ISOgrk3 **/
	y = this._fixEntity(y, "&gamma;",    "&#947;"); /** greek small letter gamma,U+03B3 ISOgrk3 **/
	y = this._fixEntity(y, "&delta;",    "&#948;"); /** greek small letter delta,U+03B4 ISOgrk3 **/
	y = this._fixEntity(y, "&epsilon;",  "&#949;"); /** greek small letter epsilon,U+03B5 ISOgrk3 **/
	y = this._fixEntity(y, "&zeta;",     "&#950;"); /** greek small letter zeta, U+03B6 ISOgrk3 **/
	y = this._fixEntity(y, "&eta;",      "&#951;"); /** greek small letter eta, U+03B7 ISOgrk3 **/
	y = this._fixEntity(y, "&theta;",    "&#952;"); /** greek small letter theta,U+03B8 ISOgrk3 **/
	y = this._fixEntity(y, "&iota;",     "&#953;"); /** greek small letter iota, U+03B9 ISOgrk3 **/
	y = this._fixEntity(y, "&kappa;",    "&#954;"); /** greek small letter kappa,U+03BA ISOgrk3 **/
	y = this._fixEntity(y, "&lambda;",   "&#955;"); /** greek small letter lamda,U+03BB ISOgrk3 **/
	y = this._fixEntity(y, "&mu;",       "&#956;"); /** greek small letter mu, U+03BC ISOgrk3 **/
	y = this._fixEntity(y, "&nu;",       "&#957;"); /** greek small letter nu, U+03BD ISOgrk3 **/
	y = this._fixEntity(y, "&xi;",       "&#958;"); /** greek small letter xi, U+03BE ISOgrk3 **/
	y = this._fixEntity(y, "&omicron;",  "&#959;"); /** greek small letter omicron, U+03BF NEW **/
	y = this._fixEntity(y, "&pi;",       "&#960;"); /** greek small letter pi, U+03C0 ISOgrk3 **/
	y = this._fixEntity(y, "&rho;",      "&#961;"); /** greek small letter rho, U+03C1 ISOgrk3 **/
	y = this._fixEntity(y, "&sigmaf;",   "&#962;"); /** greek small letter final sigma,U+03C2 ISOgrk3 **/
	y = this._fixEntity(y, "&sigma;",    "&#963;"); /** greek small letter sigma,U+03C3 ISOgrk3 **/
	y = this._fixEntity(y, "&tau;",      "&#964;"); /** greek small letter tau, U+03C4 ISOgrk3 **/
	y = this._fixEntity(y, "&upsilon;",  "&#965;"); /** greek small letter upsilon,U+03C5 ISOgrk3 **/
	y = this._fixEntity(y, "&phi;",      "&#966;"); /** greek small letter phi, U+03C6 ISOgrk3 **/
	y = this._fixEntity(y, "&chi;",      "&#967;"); /** greek small letter chi, U+03C7 ISOgrk3 **/
	y = this._fixEntity(y, "&psi;",      "&#968;"); /** greek small letter psi, U+03C8 ISOgrk3 **/
	y = this._fixEntity(y, "&omega;",    "&#969;"); /** greek small letter omega,U+03C9 ISOgrk3 **/
	y = this._fixEntity(y, "&thetasym;", "&#977;"); /** greek theta symbol,U+03D1 NEW **/
	y = this._fixEntity(y, "&upsih;",    "&#978;"); /** greek upsilon with hook symbol,U+03D2 NEW **/
	y = this._fixEntity(y, "&piv;",      "&#982;"); /** greek pi symbol, U+03D6 ISOgrk3 **/

/** General Punctuation **/
	y = this._fixEntity(y, "&bull;",     "&#8226;"); /** bullet = black small circle,U+2022 ISOpub  **/
/** bullet is NOT the same as bullet operator, U+2219 **/
	y = this._fixEntity(y, "&hellip;",   "&#8230;"); /** horizontal ellipsis = three dot leader,U+2026 ISOpub  **/
	y = this._fixEntity(y, "&prime;",    "&#8242;"); /** prime = minutes = feet, U+2032 ISOtech **/
	y = this._fixEntity(y, "&Prime;",    "&#8243;"); /** double prime = seconds = inches,U+2033 ISOtech **/
	y = this._fixEntity(y, "&oline;",    "&#8254;"); /** overline = spacing overscore,U+203E NEW **/
	y = this._fixEntity(y, "&frasl;",    "&#8260;"); /** fraction slash, U+2044 NEW **/

/** Letterlike Symbols **/
	y = this._fixEntity(y, "&weierp;",   "&#8472;"); /** script capital P = power set= Weierstrass p, U+2118 ISOamso **/
	y = this._fixEntity(y, "&image;",    "&#8465;"); /** black-letter capital I = imaginary part,U+2111 ISOamso **/
	y = this._fixEntity(y, "&real;",     "&#8476;"); /** black-letter capital R = real part symbol,U+211C ISOamso **/
	y = this._fixEntity(y, "&trade;",    "&#8482;"); /** trade mark sign, U+2122 ISOnum **/
	y = this._fixEntity(y, "&alefsym;",  "&#8501;"); /** alef symbol = first transfinite cardinal,U+2135 NEW **/
/** alef symbol is NOT the same as hebrew letter alef,U+05D0 although the same glyph could be used to depict both characters **/

/** Arrows **/
	y = this._fixEntity(y, "&larr;",     "&#8592;"); /** leftwards arrow, U+2190 ISOnum **/
	y = this._fixEntity(y, "&uarr;",     "&#8593;"); /** upwards arrow, U+2191 ISOnum**/
	y = this._fixEntity(y, "&rarr;",     "&#8594;"); /** rightwards arrow, U+2192 ISOnum **/
	y = this._fixEntity(y, "&darr;",     "&#8595;"); /** downwards arrow, U+2193 ISOnum **/
	y = this._fixEntity(y, "&harr;",     "&#8596;"); /** left right arrow, U+2194 ISOamsa **/
	y = this._fixEntity(y, "&crarr;",    "&#8629;"); /** downwards arrow with corner leftwards= carriage return, U+21B5 NEW **/
	y = this._fixEntity(y, "&lArr;",     "&#8656;"); /** leftwards double arrow, U+21D0 ISOtech **/
/** Unicode does not say that lArr is the same as the 'is implied by' arrow
    but also does not have any other character for that function. So lArr can
    be used for 'is implied by' as ISOtech suggests **/
	y = this._fixEntity(y, "&uArr;",     "&#8657;"); /** upwards double arrow, U+21D1 ISOamsa **/
	y = this._fixEntity(y, "&rArr;",     "&#8658;"); /** rightwards double arrow,U+21D2 ISOtech **/
/** Unicode does not say this is the 'implies' character but does not have 
     another character with this function so rArr can be used for 'implies'
     as ISOtech suggests **/
	y = this._fixEntity(y, "&dArr;",     "&#8659;"); /** downwards double arrow, U+21D3 ISOamsa **/
	y = this._fixEntity(y, "&hArr;",     "&#8660;"); /** left right double arrow,U+21D4 ISOamsa **/

/** Mathematical Operators **/
	y = this._fixEntity(y, "&forall;",   "&#8704;"); /** for all, U+2200 ISOtech **/
	y = this._fixEntity(y, "&part;",     "&#8706;"); /** partial differential, U+2202 ISOtech  **/
	y = this._fixEntity(y, "&exist;",    "&#8707;"); /** there exists, U+2203 ISOtech **/
	y = this._fixEntity(y, "&empty;",    "&#8709;"); /** empty set = null set, U+2205 ISOamso **/
	y = this._fixEntity(y, "&nabla;",    "&#8711;"); /** nabla = backward difference,U+2207 ISOtech **/
	y = this._fixEntity(y, "&isin;",     "&#8712;"); /** element of, U+2208 ISOtech **/
	y = this._fixEntity(y, "&notin;",    "&#8713;"); /** not an element of, U+2209 ISOtech **/
	y = this._fixEntity(y, "&ni;",       "&#8715;"); /** contains as member, U+220B ISOtech **/
	y = this._fixEntity(y, "&prod;",    "&#8719;"); /** n-ary product = product sign,U+220F ISOamsb **/
/** prod is NOT the same character as U+03A0 'greek capital letter pi' though
     the same glyph might be used for both **/
	y = this._fixEntity(y, "&sum;",      "&#8721;"); /** n-ary summation, U+2211 ISOamsb **/
/** sum is NOT the same character as U+03A3 'greek capital letter sigma'
     though the same glyph might be used for both **/
	y = this._fixEntity(y, "&minus;",    "&#8722;"); /** minus sign, U+2212 ISOtech **/
	y = this._fixEntity(y, "&lowast;",   "&#8727;"); /** asterisk operator, U+2217 ISOtech **/
	y = this._fixEntity(y, "&radic;",    "&#8730;"); /** square root = radical sign,U+221A ISOtech **/
	y = this._fixEntity(y, "&prop;",     "&#8733;"); /** proportional to, U+221D ISOtech **/
	y = this._fixEntity(y, "&infin;",    "&#8734;"); /** infinity, U+221E ISOtech **/
	y = this._fixEntity(y, "&ang;",      "&#8736;"); /** angle, U+2220 ISOamso **/
	y = this._fixEntity(y, "&and;",      "&#8743;"); /** logical and = wedge, U+2227 ISOtech **/
	y = this._fixEntity(y, "&or;",       "&#8744;"); /** logical or = vee, U+2228 ISOtech **/
	y = this._fixEntity(y, "&cap;",      "&#8745;"); /** intersection = cap, U+2229 ISOtech **/
	y = this._fixEntity(y, "&cup;",      "&#8746;"); /** union = cup, U+222A ISOtech **/
	y = this._fixEntity(y, "&int;",      "&#8747;"); /** integral, U+222B ISOtech **/
	y = this._fixEntity(y, "&there4;",   "&#8756;"); /** therefore, U+2234 ISOtech **/
	y = this._fixEntity(y, "&sim;",      "&#8764;"); /** tilde operator = varies with = similar to,U+223C ISOtech **/
/** tilde operator is NOT the same character as the tilde, U+007E,
     although the same glyph might be used to represent both  **/
	y = this._fixEntity(y, "&cong;",     "&#8773;"); /** approximately equal to, U+2245 ISOtech **/
	y = this._fixEntity(y, "&asymp;",    "&#8776;"); /** almost equal to = asymptotic to,U+2248 ISOamsr **/
	y = this._fixEntity(y, "&ne;",       "&#8800;"); /** not equal to, U+2260 ISOtech **/
	y = this._fixEntity(y, "&equiv;",    "&#8801;"); /** identical to, U+2261 ISOtech **/
	y = this._fixEntity(y, "&le;",       "&#8804;"); /** less-than or equal to, U+2264 ISOtech **/
	y = this._fixEntity(y, "&ge;",       "&#8805;"); /** greater-than or equal to,U+2265 ISOtech **/
	y = this._fixEntity(y, "&sub;",      "&#8834;"); /** subset of, U+2282 ISOtech **/
	y = this._fixEntity(y, "&sup;",      "&#8835;"); /** superset of, U+2283 ISOtech **/
	y = this._fixEntity(y, "&nsub;",     "&#8836;"); /** not a subset of, U+2284 ISOamsn **/
	y = this._fixEntity(y, "&sube;",     "&#8838;"); /** subset of or equal to, U+2286 ISOtech **/
	y = this._fixEntity(y, "&supe;",     "&#8839;"); /** superset of or equal to,U+2287 ISOtech **/
	y = this._fixEntity(y, "&oplus;",    "&#8853;"); /** circled plus = direct sum,U+2295 ISOamsb **/
	y = this._fixEntity(y, "&otimes;",   "&#8855;"); /** circled times = vector product,U+2297 ISOamsb **/
	y = this._fixEntity(y, "&perp;",     "&#8869;"); /** up tack = orthogonal to = perpendicular,U+22A5 ISOtech **/
	y = this._fixEntity(y, "&sdot;",     "&#8901;"); /** dot operator, U+22C5 ISOamsb **/
/** dot operator is NOT the same character as U+00B7 middle dot **/
/** Miscellaneous Technical **/
	y = this._fixEntity(y, "&lceil;",    "&#8968;"); /** left ceiling = APL upstile,U+2308 ISOamsc  **/
	y = this._fixEntity(y, "&rceil;",    "&#8969;"); /** right ceiling, U+2309 ISOamsc  **/
	y = this._fixEntity(y, "&lfloor;",   "&#8970;"); /** left floor = APL downstile,U+230A ISOamsc  **/
	y = this._fixEntity(y, "&rfloor;",   "&#8971;"); /** right floor, U+230B ISOamsc  **/
	y = this._fixEntity(y, "&lang;",     "&#9001;"); /** left-pointing angle bracket = bra,U+2329 ISOtech **/
/** lang is NOT the same character as U+003C 'less than sign' 
     or U+2039 'single left-pointing angle quotation mark' **/
	y = this._fixEntity(y, "&rang;",     "&#9002;"); /** right-pointing angle bracket = ket,U+232A ISOtech **/
/** rang is NOT the same character as U+003E 'greater than sign' 
     or U+203A 'single right-pointing angle quotation mark' **/
/** Geometric Shapes **/
	y = this._fixEntity(y, "&loz;",      "&#9674;"); /** lozenge, U+25CA ISOpub **/
/** Miscellaneous Symbols **/
	y = this._fixEntity(y, "&spades;",   "&#9824;"); /** black spade suit, U+2660 ISOpub **/ 
	/** black here seems to mean filled as opposed to hollow **/
	y = this._fixEntity(y, "&clubs;",    "&#9827;"); /** black club suit = shamrock,U+2663 ISOpub **/
	y = this._fixEntity(y, "&hearts;",   "&#9829;"); /** black heart suit = valentine,U+2665 ISOpub **/
	y = this._fixEntity(y, "&diams ;",   "&#9830;"); /** black diamond suit, U+2666 ISOpub **/
	return y; }
	
/**
 * CaseMan Word Processing Controller - fix HTML to XHTML - single entity replacement function
 */
CaseManWPCtrl.prototype._fixEntity = function(x, entity, entityReplacement) {
	var i = x.indexOf(entity);
	while (-1 != i) {
		x = x.substring(0,i) + entityReplacement + x.substring (i+entity.length, x.length);
		i = x.indexOf(entity); }
	return x; }

/**
 * CaseMan Word Processing Controller -- Preview the output in the editor function
 * Opens a temp PDF view of what's currently in the editor window.
 */
CaseManWPCtrl.prototype.PreviewOutputInEditor = function() {
	new CaseManWPPreview(this).runPreview(); }

/**
 * CaseMan Word Processing Controller -- Preview the output in the editor function
 * Prints what's currently in the editor window.
 */
CaseManWPCtrl.prototype.PrintOutputInEditor = function() {
	return ""; }

	
/**
 *
 */
CaseManWPCtrl.prototype.CheckForMoreEvents = function(formCtrl, dom, wpDom, nextScreen, alwaysCallback) {
	var wpDom2 = wpDom.cloneNode(true);
	var eventDoneNode = wpDom.selectSingleNode("/WordProcessing/Event/CaseEventSeq");
	var eventDoneTxt = "";
	if (null != eventDoneNode) eventDoneTxt = eventDoneNode.text;	
	var findOtherEventsXPath = "/ds/MaintainJudgment/Judgments/Judgment/JudgmentEvents/Event";
	if ("" != eventDoneTxt) findOtherEventsXPath +=  "[EventSequence != '"+eventDoneTxt+"' ]"; 		
	var eventNodes = dom.selectNodes(findOtherEventsXPath);
	if (null != eventNodes) {
		var eventLen = eventNodes.length;
		for (var j=0; j < eventLen; j++) {
			var eventNode = eventNodes[j];
			var child = null;
			var eventSeqNode = wpDom2.selectSingleNode("/WordProcessing/Event/CaseEventSeq");
			if (null!= eventSeqNode) {
				child = eventSeqNode.firstChild;
				while (null != child) {
					eventSeqNode.removeChild(child);
					child = eventSeqNode.firstChild; }
				var eventSequenceNode = eventNode.selectSingleNode("EventSequence");
				var eventSequenceText = "";
				if (null != eventSequenceNode) eventSequenceText = eventSequenceNode.text;	
				eventSeqNode.appendChild(wpDom2.createTextNode(eventSequenceText)); }
			var eventIDNode = wpDom2.selectSingleNode("/WordProcessing/Event/StandardEventId");
			if (null!= eventIDNode) {
				child = eventIDNode.firstChild;
				while (null != child) {
					eventIDNode.removeChild(child);
					child = eventIDNode.firstChild; }
				var eventIIDNode = eventNode.selectSingleNode("EventID");
				var eventIIDText = "";
				if (null != eventIIDNode) eventIIDText = eventIIDNode.text;	
				eventIDNode.appendChild(wpDom2.createTextNode(eventIIDText));
				
				/** TD TMP 352 **/
				if ("140" == eventIIDText) {
					var findApplicantXPath = "/ds/MaintainJudgment/Judgments/Judgment[JudgmentEvents/Event]/ApplicationsToVary/Variation/Applicant";
					var applicant = dom.selectSingleNode(findApplicantXPath);
					if (null != applicant) {
						var ctxJudgment = wpDom2.selectSingleNode("/WordProcessing/Judgment");
						if (null != ctxJudgment) ctxJudgment.appendChild(applicant.cloneNode(true));
					}				
				}				
			}
			WP.ProcessWP(formCtrl, wpDom2, nextScreen, alwaysCallback);	} } }