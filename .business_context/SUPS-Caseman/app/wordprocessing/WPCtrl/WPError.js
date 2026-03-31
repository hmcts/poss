/**
 * Grouping Error behaviour
 */
function WPError() 
{}

/**
 * Reports Step execution exception - ok finishes process, cancel debugs then finishes process.
 */
WPError.ReportStepServiceError = function(step, exception) {
	var process = step.getProcess();
	var output = null;
	var outputTxt = "[No Output object found in failing step's process' output.]";
	if (null != process) output = process.getOutput();
	if (null != output) outputTxt = output.toString();
	if (top.doDebug) {
		if (confirm("An exception occured whilst creating the output: \n\n" 
						+ exception.message + "\n in \n" 
						+ step + "\n\n"+
						+ outputTxt + "\n\n"+
				"\n\nClick OK to aknowledge the creation of the output is now halted.\n"+
				"\nClick Cancel to debug the exception.\n")) {
			WPError.FinishProcessOfStep(step); }
		else {
			WPError.FinishProcessOfStep(step); } } 
	else {
		alert("An exception occured whilst creating the output: \n\n" 
						+ exception.message + "\n in \n" 
						+ step + "\n\n"+
						+ outputTxt + "\n\n"+
				"\n\nClick OK to aknowledge the creation of the output is now halted.\n");
		WPError.FinishProcessOfStep(step); } }
		
/** 
 * Finishes the process to which the step belongs.
 */ 		
WPError.FinishProcessOfStep = function(step) {
	WPError.FinishProcess(step.getProcess());	}
	
/** 
 * Finishes the process.
 */ 		
WPError.FinishProcess = function(p) {
	p.lastStep = p.steps.length -1; 
	WP.SetState(p, WPState.QA_Done, true);
	WP.SetState(p, WPState.LoadXHTMLDone, true);
	WP.SetState(p, WPState.FW_PollReport_Ready, true);
	WP.SetState(p, WPState.FW_PollXHTML_Ready, true);
	WP.SetState(p, WPState.FW_PollReport_Cancelled, true);
	WP.SetState(p, WPState.FW_PollXHTML_Cancelled, true);
	WP.SetState(p, WPState.FW_CreateReport_Ready, true);
	WP.SetState(p, WPState.EditingDone, true);
	WP.SetState(p, WPState.wpl_DOM_Ready, true); 
	WP.SetState(p, WPState.wps_DOM_Ready, true); }