/**
 * WPFrameworkReporting (WPFR) represents all functionality specific to the integration with the 
 * SUPS Framework Reporting solution.
 * The functionality exposed in this file/these classes is used by the framework version of the
 * CaseManWPProcess class (and more specifically, it's steps)
 * Change History
 * 05/12/2012 - Chris Vincent: Bulk Printing (Trac 4761), changes to FXSL_CreateRequestPDF() to prevent
 * the print now or later confirm dialog from appearing and prevent the output from being sent for print
 * should the output be destined for bulk printing.
 */ 
function  WPFR() {}

/**
 * WP FR  Timeout period for waiting for sups reporting completion
 * @type number
 */
WPFR.TIMEOUT			= 1000*60*2;
/**
 * WP FR  Timeout period for waiting for sups reporting completion
 * @type string
 */
WPFR.TIMEOUT_PHRASE		= "two minutes";

/**
 * WP FR  Timeout period for opening the PDF window
 * this works around the focus problem of this popup window
 * @type number
 */
WPFR.TIMEOUT_PDFWIND	= 1000*2;

/** DO NOT CHANGE */
WPFR.STATUS_QUEUED 		= "0";
WPFR.STATUS_QUEUED_int 	= 0;
WPFR.STATUS_PROCES		= "1";
WPFR.STATUS_PROCES_int	= 1;
WPFR.STATUS_SAVING		= "2";
WPFR.STATUS_SAVING_int	= 2;
WPFR.STATUS_COMPLETE	= "3";
WPFR.STATUS_COMPLETE_int= 3;
WPFR.STATUS_ERROR		= "4";
WPFR.STATUS_ERROR_int	= 4;
/** DO NOT CHANGE */

/**
 * Word Processing Framework - MIME type PDF.
 */
WPFR.MINETYPE_PDF = "application/pdf";

/** 
 * Word Processing Framework - MIME type HTML.
 */
WPFR.MINETYPE_HTML = "application/html";

/**
 * Word Processing Framework - PrintType: PDF to PostScript.
 */
WPFR.PRINTTYPE_PDFPDF = "pdf2ps";

/**
 * Word Processing Framework i8ntegration - storage period -1 - default setting - output config may override)
 */
WPFR.DEFAULT_STORAGE_PERIOD = -1;

/**
 * Word Processing Framework i8ntegration - default printer tray 1 - default setting - output config may override)
 * (value used to be "0" but changed upon UCT Defect 364)
 */
WPFR.TMP_POPT_TRAY = "";

/**
 * Word Processing Framework i8ntegration - Number of copies - 1 - default setting - output config may override)
 */
WPFR.TMP_POPT_NOCO = 1;

/**
 * Word Processing Framework integration - Duplex Printing attribute - false by default (output spe
 */
WPFR.TMP_POPT_DUPL = "false";


/**
 *
 * @retuns xml string conformation to Request.xsd
 */
WPFR._RePrintRequest = function(wpprocess, p_t, p_d_s, p_d_p, p_o_t, p_o_nc, p_o_d, mime, dur, p_o_t2, p_o_nc2, p_o_d2) {
	var rMime = mime ? mime : WPFR.MINETYPE_HTML;
	var rDur = dur ? dur : WPFR.DEFAULT_STORAGE_PERIOD;
	var rRef = WPFR.GetOutputXHTMLTemplateURL(wpprocess);
	var s = "<ListReportRequest>" + WPFR._GetPrintXML(p_t, p_d_s, p_d_p, p_o_t, p_o_nc, p_o_d) + "<ReportReference><Id>"+rRef+"</Id></ReportReference></ListReportRequest>";	
	if (doLog) do_Log("WPFR._FXSL_CreateRequest returns "+s);
	return s; }


/**
 *
 * @retuns xml string conformation to Request.xsd
 */
WPFR._FXSL_CreateRequestXHTML = function(wpprocess, p_t, p_d_s, p_d_p, p_o_t, p_o_nc, p_o_d, mime, dur, p_o_t2, p_o_nc2, p_o_d2) {
	var rMime = mime ? mime : WPFR.MINETYPE_HTML;
	var rDur = dur ? dur : WPFR.DEFAULT_STORAGE_PERIOD;
	var rRef = WPFR.GetOutputXHTMLTemplateURL(wpprocess);
	var s = "<XSLReportRequest>"+ WPFR._GetFXSLReportXHTML(wpprocess, rMime, rDur, rRef) +"</XSLReportRequest>";	
	if (doLog) do_Log("WPFR._FXSL_CreateRequest returns "+s);
	return s; }

/**
 *
 */
WPFR._GetFXSLReportXHTML = function(wpprocess, mime, dur, ref) {
	var s =	"<XSLReport>"+ WPFR._GetFXSLReportContent(wpprocess, mime, dur, ref) +"</XSLReport>";
	return s; }

/**
 *
 */
WPFR._FXSL_CreateRequestPDF = function(wpprocess, p_t, p_d_s, p_d_p, p_o_t, p_o_nc, p_o_d, mime, dur, p_o_t2, p_o_nc2, p_o_d2) {
	var rMime = mime ? mime : WPFR.MINETYPE_PDF;
	var rDur = dur ? dur : WPFR.DEFAULT_STORAGE_PERIOD;
	var rRef = WPFR.GetXSLURL(wpprocess);
	var printXML = "";
	if ("true" != WP.GetState(wpprocess, WPState.Preview)) {
		var userWantsPrint = true;
		var output = wpprocess.getOutput();
		if (output != null && ("true"!=output.getDoWP()) && !output.getDoBulkPrint() ) {
			/** UCT 652 **/
			var d1 = output.getCJRReference();
			var d2 = output.getNReference();
			var d3 = output.getDescription();
			var desc;
			if (d2 == "" ||d2 == null ||  d1 == d2) desc = d1 + ", " + d3;
			else desc = d1 + ", " + d2 + ", " + d3;
			if ( d2 != "N441A") {
				// UCT_Group2 Defect 1601 - For certificate of satisfaction, should not offer option of printing later
				userWantsPrint = confirm("Click 'OK' to print " + desc + " now.\nClick 'Cancel' to print output later.");
			}
		}	
		
		/** Avoiding serverside reprint upon opening final document - clientside print of these agreed during uat **/
		var context = wpprocess.getRequest().getContext()
		var finalNode = context.selectSingleNode("//Final");
		var final = "N";
		if (null != finalNode) {
			final = WPS.getNodeTextContent(finalNode);
			if ("Y" == final) {
				userWantsPrint = false; } }
		
		// Outputs to be sent to bulk printing should not be printed locally		
		if ( output != null && output.getDoBulkPrint() )
		{
			userWantsPrint = false;
		}
			
		printXML = ((top.wpPRTwp && userWantsPrint) ? WPFR._GetPrintXML(p_t, p_d_s, p_d_p, p_o_t, p_o_nc, p_o_d) : "" ); 
	}
	var s =	"<XSLFOReportRequest>"+
				printXML +
				"<Reference>"+rRef+"</Reference>"+
				WPFR._GetFXSLReportPDF(wpprocess, rMime, rDur, rRef) +
			"</XSLFOReportRequest>";			
	if (doLog) do_Log("WPFR._FXSL_CreateRequest returns "+s);
	return s; }

/**
 *
 */
WPFR._GetFXSLReportPDF = function(wpprocess, mime, dur, rRef) {
	var s = "<XSLFOReport>"+ WPFR._GetFXSLReportContent(wpprocess, mime, dur, rRef) + "</XSLFOReport>";
	return s; }

/**
 *
 */
WPFR._GetFXSLReportContent = function(wpprocess, mime, dur, templateUri) {
	var s =	"<Id/>"+
			"<TemplateId/><MimeType>"+mime+"</MimeType><StorageDuration>"+dur+"</StorageDuration>"+
			"<XSLParameters>"+
				"<XSL>"+templateUri+"</XSL>"+
				"<Data>"+WPFR.GetTransformedData(wpprocess)+"</Data>"+
			"</XSLParameters>";
		return s; }

/**  GENERIC XML  **/
 
/**
 * WP FR Constructs the XML for printint a report to a printer on a fap server.
 */
WPFR._GetPrintXML = function(p_t, p_d_s, p_d_p, p_o_t, p_o_nc, p_o_d) {
	var s = "";
	var badPT	= false;
	var badPDS	= null == p_d_s ? true : false;
	var badPDP	= null == p_d_p ? true : false;
	var badPOT  = false;
	var badPONC = false;
	var badPOD	= false;
	if (badPT || badPDS || badPDP || badPOT || badPONC || badPOD) {
		alert("Your Printer Configuration is incomplete - therefore this output can not be printed...\n\nFAPServer: " + p_d_s+ "\nPrinter: " + p_d_p); }
	else {
		s = "<Print><Type>"+p_t+"</Type><Destination><Server>"+p_d_s+"</Server><Printer>"+p_d_p+"</Printer></Destination><Options><Tray>"+p_o_t+"</Tray><NumCopies>"+p_o_nc+"</NumCopies><Duplex>"+p_o_d+"</Duplex></Options></Print>";	}
	return s; }

/**
 *
 */
WPFR._GetSendXML = function(p_t, p_d_s, p_d_p, p_o_t, p_o_nc, p_o_d) {
	var s = "<Send><Type>"+p_t+"</Type><Destination><Server>"+p_d_s+"</Server><Printer>"+p_d_p+"</Printer></Destination><Options><Tray>"+p_o_t+"</Tray><NumCopies>"+p_o_nc+"</NumCopies><Duplex>"+p_o_d+"</Duplex></Options></Send>";
	return s; }
	
/**
 * WPFR GetVariableData function is used by the code linking into the framework, as a callback. 
 * This function must return the variabledata as produced by the server transformation step.
 */
WPFR.GetVariableData = function(wpprocess) {
	var x = null;
	var txDOM = WP.GetState(wpprocess,"txDOM");	
	x = txDOM.selectSingleNode("/params/param[@name='xml']/*").xml;				
	return x; }

/**
 * WPFR GetVariableData function is used by the code linking into the framework, as a callback. 
 * This function must return the variabledata as produced by the server transformation step.
 */
WPFR.GetTransformedData = function(wpprocess) {
	var x = null;
	var txDOM = WP.GetState(wpprocess, WPState.tx_DOM);	
	var node = txDOM.selectSingleNode("/params/param[@name='xml']/*[1]");	
	if (null == node) node = txDOM.selectSingleNode("/getdata/variabledata");	
	if (null == node) node = txDOM.selectSingleNode("variabledata");	
	var wpDOM = WP.GetState(wpprocess, WPState.wps_DOM);
	if (null != wpDOM) {
		var origNode = node.selectSingleNode("xhtml");
		var childNodesAr = origNode.selectNodes("*");
		for(var i=0; i < childNodesAr.length; i++) {
			origNode.removeChild(childNodesAr[i]); }		
		node.selectSingleNode("xhtml").appendChild(wpDOM.documentElement.cloneNode(true)); }
	x = node.xml;		
	return x; }

/**
 *
 */
WPFR.GetXSLURL = function(wpprocess) {
	var ref = wpprocess.getOutput().getXSLFOUrl(wpprocess);
	if (doLog) do_Log("WPFR.GetXSLURL returns "+ref);	
	return ref; }

/**
 *
 */
WPFR.GetOutputXHTMLTemplateURL = function(wpprocess) {
	var ref = wpprocess.getOutput().getXSLXHTMLUrl();
	if (doLog) do_Log("WPFR.GetOutputXHTMLTemplateURL returns "+ref);	
	return ref; }

/**
 * WPFR Function decoding the status of report generation into a human readable (for UI) string
 * @argument status integer as determined by the framework reporting and printing solution
 * @returns string representation of the report generation status
 */
WPFR.DecodeReportGenerationStatus = function(status)  {
	switch(status) {
		case "0": return "Report has been queued"; 			break;
		case "1": return "Report is being generated";		break;
		case "2": return "Report is being saved";			break;
		case "3": return "Report generation has completed";	break;
		case "4": return "Error in producing Report";		break;
		case "5": return " ";								break; } }

/**
 * WPFR Function decoding the status of report printing into a human readable (for UI) string
 * @argument status integer as determined by the framework reporting and printing solution
 * @returns string representation of the report printing status
 */
WPFR.DecodeReportPrintStatus = function(status) {
	switch(status) {
		case "0": return "Printing yet to start"; break;
		case "1": return "Printing in progress"; break;
		case "2": return "Printing finished"; break;	
		case "4": return "Printing error"; break; } }
				
		
/**
 * Displays a document from the Content Servlet with the specified Id.
 *
 * @param reportName The name of the report.
 * @param id The document id.
 * @param screenX The x co-ordinate of the report window (optional, default = 100)
 * @param screenY The y co-ordinate of the report window (optional, default = 60)
 * @param width   The width of the report window (optional, default = 800)
 * @param height  The height of the report window (optional, default = 600)
 */
WPFR.ShowDocument = function(reportName, id, screenX, screenY, width, height) {
	Services.showDocument(reportName, id, screenX, screenY, width, height);
	/**
	var ac = Services.getAppController();
	var screenX = screenX != null ? screenX : 100;
	var screenY = screenY != null ? screenY : 60;
	var width = width != null ? width : 800;
	var height = height != null ? height : 600;
	var SERVLET = ac.m_config.getServiceBaseURL() + "_content/ContentServlet";
	var USER_PARAM = "?user=";
	var MAC_PARAM = "&mac=";
	var DOCUMENTID_PARAM = "&DocumentId=";
	var securityContext = ac.m_securityContext;
	var username = securityContext.getCurrentUser().getUserName();
	var mac = securityContext.generateMac(id);
	var urlArr = new Array();
	urlArr.push(SERVLET);
	urlArr.push(USER_PARAM);
	urlArr.push(username);
	urlArr.push(MAC_PARAM);
	urlArr.push(mac);
	urlArr.push(DOCUMENTID_PARAM);
	urlArr.push(id);
	var url = urlArr.join("");
	var featureArr = new Array();
	featureArr.push("left="+screenX);
	featureArr.push("top="+screenY);
	featureArr.push("screenX="+screenX);
	featureArr.push("screenY="+screenY);
	featureArr.push("width="+width);
	featureArr.push("height="+height);
	featureArr.push("resizable=yes");
	var feature = featureArr.join(",");
	var w = window.open("", "wpwinfor"+id, feature);
	w.focus();
	var doc = w.document;
	doc.open();
	doc.writeln("<html><head><title>"+reportName+"</title>");
	doc.writeln("<body style=\"margin: 0 0 0 0; padding: 0 0 0 0; border: 0 0 0 0;\">");
	doc.writeln("<iframe name='PDFView' src='"+url+"' style='height: 100%; width:100%;'></iframe>");
	doc.writeln("</body></html>");
	doc.close(); **/}	
		
/**
 * Creates a Print Config Object (array) specific to the process (and it's output),
 * containing; fap, printer, tray, copies, duplex settings.
 */
WPFR._GetPrintConfig = function(process) {
	var cfg = new Array();
	cfg["type"] 			= WPFR.PRINTTYPE_PDFPDF;	
	var fapServer 			= process.getFAPServer();	
	if (doLog) do_Log("WPFR._GetPrintConfig() Process FAP Server "+fapServer);	
	if (null == fapServer || "" == fapServer) {
		fapServer = WPS.__Services().getValue("/ds/var/app/UserData/CourtFapServer");
		if (doLog) do_Log("WPFR._GetPrintConfig() /ds/var/app/UserData/CourtFapServer "+fapServer);	}	
	cfg["server"] 			= fapServer;
	var printerName			= process.getDefaultPrinter();
	if (doLog) do_Log("WPFR._GetPrintConfig() Process PrinterName "+printerName);	
	if (null == printerName || "" == printerName) {
		printerName = WPS.__Services().getValue("/ds/var/app/UserData/UserPrinter");
		if (doLog) do_Log("WPFR._GetPrintConfig() /ds/var/app/UserData/UserPrinter "+printerName);	
		if (null == printerName || "" == printerName) {
			printerName = WPS.__Services().getValue("/ds/var/app/UserData/CourtPrinter");		
			if (doLog) do_Log("WPFR._GetPrintConfig() /ds/var/app/UserData/CourtPrinter "+printerName);	} }
	cfg["printer"] 			= printerName;		
	cfg["tray"] 			= process.getTraySetting(WPFR.TMP_POPT_TRAY);
	if (doLog) do_Log("WPFR._GetPrintConfig() Process tray "+cfg["tray"]);	
	cfg["numberOfCopies"] 	= process.getCopiesSetting(WPFR.TMP_POPT_NOCO);
	if (doLog) do_Log("WPFR._GetPrintConfig() Process numberOfCopies "+cfg["numberOfCopies"]);	
	cfg["duplex"] 			= process.getDuplexSetting(WPFR.TMP_POPT_DUPL);
	if (doLog) do_Log("WPFR._GetPrintConfig() Process duplex "+cfg["duplex"]);	
	return cfg; }
		
/**
 * intialisation of printing customisation (on/off)
 */
function InitPrintintSwitches() {
	var params = WP.GetURLParameters();
	var p1 = params['wpPRTwp'];
	p1 = 'true' == p1 ? true  : false;
	top.wpPRTwp = p1;
	var p2 = params['wpPRTora'];	
	p2 = 'true' == p2 ? true  : false;	
	top.wpPRTora = p2;
	if (false == p1 || false == p2) alert("- Temporary Intitialisation Parameters -\n\nPrinting WP: " + top.wpPRTwp + "\nPrtinting ORA: " + top.wpPRTora);
	top.InitPrintintSwitchesDone =  true; }
	