/**
 * To create collections of states
 */
function WPState() {}

/** **/
WPState.ProgressBarUp = "ProgressBarUp";

/** **/
WPState.DocumentId = "documentId";

/** **/
WPState.XhtmlDocumentId = "xhtmldocumentId";

/** Word Processing State - Printed Flag for a process **/
WPState.wps_Printed = "documentprinted";

/** **/
WPState.tx_DOM_Reloaded = "ReloadedTheSavedOutputVariableData";
/**
 * Word Processing State - Last Polled Server for Report Status On
 */
WPState.FW_PollReport_LastTime	= "PollLastOn";

/**
 * Word Processing State - Last Polled Server for Report Status On
 */
WPState.FW_PollReport_FirstTime	= "PollFirstOn";

/**
 * Word Processing State - Last Polled Server for Report Status Ready Polling
 */
WPState.FW_CreateReport_Ready	= "CreatePDFReady";

/**
 * Word Processing State - 
 */
WPState.FW_CreateReport_DOM		= "CreatePDFDOM";

/**
 * Word Processing State - 
 */
WPState.FW_PollReport_Ready		= "PollPDFReady";

/**
 * Word Processing State - Last Polled Server for Report Status On
 */
WPState.FW_PollXHTML_Ready 		= "PollXHTMLReady";

/**
 * Word Processing State - Last Polled Server for Report Status On
 */
WPState.FW_PollXHTML_LastTime   = "PollXHTMLLastOn";
/**
 * Word Processing State - Last Polled Server for Report Status On
 */
WPState.FW_PollXHTML_FirstTime   = "PollXHTMLFirstOn";
/**
 * Word Processing State - 
 */
WPState.FW_PollReport_Cancelled	= "PollReportCancelled";

/**
 * Word Processing State - 
 */
WPState.FW_PollXHTML_Cancelled	= "PollXHTMLCancelled";

/**
 * WPState, Step: Data Source
 */
WPState.ds_DOM					= "dsDOM";
/**
 * WPState, Step: Data Source
 */
WPState.ds_DOM_Ready			= "dataLoadDone";
/**
 * WPState, Step: Data Source
 */
WPState.ds_DOM_Reload_Ready		= "ReloadDone";
/**
 * WPState, Step: Transformation
 */
WPState.tx_DOM					= "txDOM";
/**
 * WPState, Step: Transformation
 */
WPState.tx_DOM_Ready			= "txDONE";
/**
 * WPState, Step: Store
 */
WPState.st_DOM					= "storeResultDOM";
/**
 * WPState, Step: Store
 */
WPState.st_DOM_Ready			= "StoneDone";
/**
 * WPState, Step: Load
 */
WPState.wpl_DOM					= "wpLoadDOM";
/**
 * WPState, Step: Load
 */
WPState.wpl_DOM_Ready			= "wpLoadDONE";
/**
 * WPState, Step: WP Store
 */
WPState.wps_DOM					= "wpDOM";
/**
 * WPState, Step: WP Store - output final indicator
 */
WPState.wps_FIN					= "wpFinal";
/**
 * WPState, Step: WP Store
 */
WPState.wps_DOM_Ready			= "WPSaveDone";
/**
 * WPState, Step: WP Store, document of the edited xhtml stored
 */
WPState.wps_DocId				= "WPSaveXHTMLDocumentId";
/**
 * WPState, Step: WP Print
 */
WPState.wpp_Ready				= "PrintDone";
/**
 * WPState, Step: Open Output
 */
WPState.ooo_EdirOrView			= "EditOrView";
/**
 * WPState, Step: Open Output
 */
WPState.ooo_OutputId			= "OutputIdToEditOrView";
/**
 * WPState, Step: Open Output, ready
 */
WPState.ooo_Ready				= "EditOrViewReady";
/**
 * WPState, QA Screen, Header Number
 */
WPState.QA_HeaderNumber 		= "QA_HeaderNumber";
/**
 * WPState, QA Screen, Header Parties
 */
WPState.QA_HeaderParties 		= "QA_HeaderParties";
/**
 * WPState, QA Screen, Header/Screen Type
 */
WPState.QA_ScreenType 			= "QA_ScreenType";

WPState.QA_Done					= "QADone";

WPState.LoadXHTMLDone			= "WPLoadXHTMLDone";

WPState.EditingDone				= "WPEditingDone";

WPState.Preview					= "WPPreview";

/**
 * WPState AllStates class attribute is an Array refering to the individual WPState class attributes representing a state key.
 */
WPState.ALLStates = [
	WPState.ds_DOM,
	WPState.ds_DOM_Ready,
	WPState.ds_DOM_Reload_Ready,
	WPState.DocumentId,
	WPState.EditingDone,
	WPState.FW_CreateReport_DOM,
	WPState.FW_CreateReport_Ready,
	WPState.FW_PollReport_Cancelled,
	WPState.FW_PollReport_FirstTime,
	WPState.FW_PollReport_LastTime,
	WPState.FW_PollReport_Ready,
	WPState.FW_PollXHTML_Cancelled,
	WPState.FW_PollXHTML_FirstTime,
	WPState.FW_PollXHTML_LastTime,
	WPState.FW_PollXHTML_Ready,
	WPState.LoadXHTMLDone,
	WPState.ooo_EdirOrView,
	WPState.ooo_OutputId,
	WPState.ooo_Ready,
	WPState.ProgressBarUp,
	WPState.QA_Done,
	WPState.QA_ScreenType,
	WPState.QA_HeaderParties,
	WPState.QA_HeaderNumber,
	WPState.st_DOM,
	WPState.st_DOM_Ready,
	WPState.tx_DOM,
	WPState.tx_DOM_Ready,
	WPState.tx_DOM_Reloaded,
	WPState.wpl_DOM,
	WPState.wpl_DOM_Ready,
	WPState.wpp_Ready,
	WPState.wps_DocId,
	WPState.wps_DOM,
	WPState.wps_DOM_Ready,
	WPState.wps_DocId,
	WPState.wps_FIN,
	WPState.wps_Printed,
	WPState.XhtmlDocumentId,
	WPState.Preview
	];
	
/** 
 * Removes all the state held in the controller for the output specified
 * @argument WPOutput output
 * @returns void
 */
WPState.RemoveAllState = function(output) {
	var msg = "WPState.RemoveAllState ";
	do_Log(msg + " output= " + (output ? output.toString() : "null output"));	
	if (null != output) {
		var noOfStates = WPState.ALLStates.length;
		do_Log(msg + " noOfStates= " + noOfStates);		
		for (var i=0; i < noOfStates; i++) {
			var stateKey = output.getStateId(WPState.ALLStates[i]);
			do_Log(msg + " stateKey["+i+"] = " + stateKey);
			WP.ClearStateKey(stateKey); } }
	else {
		// remove all state		
	} }