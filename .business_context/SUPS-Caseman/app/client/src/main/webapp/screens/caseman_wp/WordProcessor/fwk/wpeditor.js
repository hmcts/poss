/** Include the overridden Framework File **/
includeJS("WordProcessingGUIAdaptorOverride.js");

/** SubForm Progress Bar for SUPS Reporting transactions **/
function ProgressBar_SubForm() {}
ProgressBar_SubForm.subformName = "CasemanWpOrarepProgress";

/** Form **/
function WPFCKEditor() {};

/** Form init **/
WPFCKEditor.initialise = function() {
	//setTimeout("WPFCKEditor.load();",500); }
	WPFCKEditor.load(); }

/** Delayed/Timeout initialisation of editor with content **/
WPFCKEditor.load = function() {
	var process = WP.GetScreenProcess();
	var editor = Services.getAdaptorById("wpFwkEditor");
	WP.SetXhtmlInEditor(process, editor); }
	
	
/** CaseMan Print Function **/
WPFCKEditor.printAction = function() {
	WP.PrintOutputInEditor();}

/** CaseMan Save Function **/
WPFCKEditor.saveAction = function() { 
	if (WPFCKEditor.saveXHTML()) {
		var prcs = WP.GetScreenProcess();
		var final = "N";
		var flag = WPS.getValue(OutputFinal.dataBinding);
		if ("Y" == flag) { final = "Y"; }
		WP.SetState(prcs, WPState.wps_FIN, final);
		WP.SetState(prcs, WPState.EditingDone, true); } }

/** Save the XHTML **/
WPFCKEditor.saveXHTML = function() { 
	var prcs = WP.GetScreenProcess();
	var edtr = Services.getAdaptorById("wpFwkEditor");
		
	var proceedSave = WP.RemoveTextOutsideEditableSectionsTable(edtr);
	if (true != proceedSave) return false;
	
	var html = edtr.getHTML();
	/** stripping the style element from before the table of editable sections **/
	var startOfTableTag = html.indexOf("<table ") ;
	/** uct 850, do string till end of table, not end of html string **/
 	var closeingTablePos = html.lastIndexOf("</table>");
 	closeingTablePos += 8;
 	html = html.substring(startOfTableTag, closeingTablePos);
 	
 	var xhtm = WPS.createDOM();
	var good = xhtm.loadXML(html);
	if (!good) {
		html = WP.FixHTML(html);
		good = xhtm.loadXML(html);
		if (!good) {
		    if (doLog) do_Log("Invalid XHTML fom Editor, after trying to fix it: \n\n " + html);
			if (confirm("The editor did not return valid XHTML.\n\nClick 'OK' to reload the content in the editor, 'CANCEL' to stop the WP Process.")) {
				CaseManWPProcessStep__LoadEditor.reloadEditor(prcs,edtr)
				return false; }
			else {		
				top.WPError.FinishProcessOfStep(prcs.steps[0]);
				return false; } } }
	if (good) {
		var xhtml = WP.GetState(prcs, WPState.wpl_DOM); 
		var editableDivs = xhtml.selectNodes("//div[@class='EDITME']");
		var noOfEditDivs = editableDivs.length;
		if (0 == noOfEditDivs) {
			alert("The editable section content separators are (partially) missing.  The editor must be reloaded in order to produce the output.");
			CaseManWPProcessStep__LoadEditor.reloadEditor(prcs, edtr);
			return false; }
		for (var divIdx=0; divIdx < noOfEditDivs; divIdx++) {
			var divNode = editableDivs[divIdx]
			var divId = divNode.selectSingleNode("@id").value;
			var tdNode = xhtm.selectSingleNode("//td[@id='"+divId+"']");
			if (null != tdNode) {
				var clonedTd = tdNode.cloneNode(true);
				var child = divNode.firstChild;
				while (null != child) {
					divNode.removeChild(child);
					child = divNode.firstChild;	}
				child = tdNode.firstChild;
				while (null != child) {
					divNode.appendChild(child);
					child = tdNode.firstChild; } }
			else {
				alert("The editable section content separators are (partially) missing.  The editor must be reloaded in order to produce the output.");
				CaseManWPProcessStep__LoadEditor.reloadEditor(prcs, edtr);
				return false; } }
		WP.SetState(prcs, WPState.wps_DOM, xhtml); }
	else {
		CaseManWPProcessStep__LoadEditor.reloadEditor(prcs, edtr);
		return false; }
	return true; }

/** CaseMan Print Preview Function **/
WPFCKEditor.previewAction = function() {
	if (WPFCKEditor.saveXHTML()) {
		WP.PreviewOutputInEditor(); } }

/** WP GUI Adaptor Field **/
function wpFwkEditor() {};

/** Editor Configuration **/
wpFwkEditor = {
	dataBinding: 	"/ds/var/form/word1"
	,toolBarSet:	"SUPSDefault"
	,height: 		"535px"
	,width: 		"100%" };

/** Output Final Checkbox **/
function OutputFinal() {}
OutputFinal.dataBinding = "/ds/var/form/finalmarker";
OutputFinal.modelValue = {checked: "Y", unchecked: "N"}; 
OutputFinal.hintText = "Check box to mark output as final (no further editing possible after save)";

/** Status bar - preview **/
function Status_PreviewBtn() {}
Status_PreviewBtn.tabIndex = 49;
Status_PreviewBtn.actionBinding = function() { WPFCKEditor.previewAction(); }

/** Status bar - ok **/
function Status_OKBtn() {}
Status_OKBtn.tabIndex = 50;
Status_OKBtn.actionBinding = function() { WPFCKEditor.saveAction(); }

/** Status bar - cancel **/
function Status_CancelBtn() {}
Status_CancelBtn.tabIndex = 51;
Status_CancelBtn.actionBinding = function() { 
	var process = WP.GetScreenProcess();
	top.WPError.FinishProcessOfStep(process.steps[0]); }