/**
 * Change History
 * 27/11/2012 - Chris Vincent: Added new doBulkPrint attribute including initialisation and get & set methods.  Trac 4761
 */

/**
 * SUPS CaseMan Word Processing Output
 * @constructor
 */
function CaseManWPOutput(configxml) {
	/**
	 * Attribute holding the CJR number identifying the CaseMan WP OUtput
	 */
	this.refCJR = null;
	/**
	 * Attribute holding the N number identifying the CaseMan WP OUtput
	 */
	this.refN = null;
	/**
	 * Attribute holding the description of the CaseMan WP OUtput
	 */
	this.refDescription = null;
	/**
	 * Attribute indicated whether or not to produce the output for CCBC.
	 */
	this.doCCBC = null; 
	/**
	 * Attribute (boolean) indicating whether or not this output requires a QA Screen
	 */
	this.doQA = null;	
	/**
	 * Attribute (boolean) indicating whether or not this output requires to have its data reloaded after the
	 * QA screen has been saved (as this may create fresh data that is also required for the output xsl variables)
	 */
	this.doReload = null;	
	/**
 	 * Attribute (boolean) indicating whether or not this output requires a WP editor Screen
	 */
	this.doWP = null;
	/**
	 * Attribute indicating use of alternative process to the one programmatically set (ie 'Create' in the call to WP).
	 */
	this.altProcess = null;
	/** 
	 * Attribute indicating the duplex nature of the output
	 */
	this.doDuplex = null;
	/** 
	 * Attribute indicating the tray to print to 
	 */
	this.doPrintTray = null;
	/** 
	 * Attribute indicating the number of copies to print
	 */
	this.doPrintCopies = null;
	/** 
	 * Attribute indicating whether the output is to be sent for bulk printing
	 */
	this.doBulkPrint = null;
	/**
	 * Attribute indicating if the output has a different template if marked as final
	 */
	this.finalOutput = null;
	
	WPOutput.apply(this,[configxml]); }

/**
 * SUPS CaseMan Word Processing Output -- OO: setting the super class
 */
CaseManWPOutput.prototype = new WPOutput();

/**
 * SUPS CaseMan Word Processing Output -- OO: Instance attribute refering to the Class' constructor
 */
CaseManWPOutput.prototype.constructor = CaseManWPOutput;

/**
 * SUPS CaseMan Word Processing Output - returns the url for the xsl fo stylesheet to be used in fo creation.
 * @argument wpprocess - the process processing this output
 * @returns url to the xslfo xsl.
 */
CaseManWPOutput.prototype.getXSLFOUrl = function(wpprocess) {
	var url = this.getCJRReference();
	/** 
	 *  part of TD 5332 fix L_BLANK has L_BLANK, L_BLANK_CO and L_BLANK_AE flavours,
	 *	creating a CO or AE flavour fails (in the reopen output scenario)
	 */
	var context = wpprocess.getRequest().getContext();
	if (null != context) {
		var eventNode = context.selectSingleNode(CaseManWPXPath.EventStandardId);
		if (null != eventNode) {
			var event = WPS.getNodeTextContent(eventNode);
			
			var coNumberNode = context.selectSingleNode(CaseManWPXPath.CONumber);
			var coNumber = "";
			if (null != coNumberNode) coNumber = WPS.getNodeTextContent(coNumberNode);
			var isCOEvent = ("" != coNumber);
			
			var aeNumberNode = context.selectSingleNode(CaseManWPXPath.AENumber);
			var aeNumber = "";
			if (null != aeNumberNode) aeNumber = WPS.getNodeTextContent(aeNumberNode);
			var isAEEvent = ("" != aeNumber);
			
			if (105 == event) {
				if (isCOEvent && "Open" == wpprocess.getName()) url += "_CO"; 
				}
			else if (100 == event) {
				if (isCOEvent) {
					url += "_CO"; }
				//else if (isAEEvent) {
				//	url += "_AE"; }							
			}
		}
		var coNumberNode = context.selectSingleNode(CaseManWPXPath.CONumber);
		
		var aeNumberNode = context.selectSingleNode(CaseManWPXPath.AENumber);

		var finalFlag = WP.GetState(wpprocess, WPState.wps_FIN);
		if ( finalFlag == "Y" && this.getFinalOutput() == true ) {
			url += "-Final";
		}
		
	}
	else {
		
	}
	
	url += "-FO.xsl";
	return url; }


/**
	<WordProcessing>
		<Event>
			<COEventSeq>109445</COEventSeq>
			<StandardEventId>105</StandardEventId>
			<CONumber>060211NN</CONumber>
		</Event>
		<Type>WP</Type>
		<Final>N</Final><OutputId>115240</OutputId><Description>Word Processing Output</Description><DocumentId>35895</DocumentId><Request>Open</Request></WordProcessing>
*/
/**
 * SUPS CaseMan Word Processing Output - returns the url for the xsl fo stylesheet to be used in XHTML creation.
 * @returns url to the xslXHTML xsl.
 */
CaseManWPOutput.prototype.getXSLXHTMLUrl = function() {
	var cjr = this.getCJRReference();
	var url = cjr + "-XHTML.xsl";
	return url; }

/**
 * SUPS CaseMan Word Processing Output - Instance initalisation
 * Parses the configXml passed into the constructor for its data.
 * @returns void
 */
CaseManWPOutput.prototype.initialise = function() {
	var cfg = this.configXml;
	this.refCJR 		= WPS.getNodeTextContent(cfg.selectSingleNode(CaseManWPXPath.OutputCJR));
	this.refN 			= WPS.getNodeTextContent(cfg.selectSingleNode(CaseManWPXPath.OutputN));
	this.refDescription = WPS.getNodeTextContent(cfg.selectSingleNode(CaseManWPXPath.OutputDescription));
	this.doQA 			= WPS.getNodeTextContent(cfg.selectSingleNode(CaseManWPXPath.OutputQA));
	this.doWP 			= WPS.getNodeTextContent(cfg.selectSingleNode(CaseManWPXPath.OutputWP));
	this.doReload 		= WPS.getNodeTextContent(cfg.selectSingleNode(CaseManWPXPath.OutputReload)); 
	this.altProcess     = WPS.getNodeTextContent(cfg.selectSingleNode(CaseManWPXPath.AltProcess));
	this.doCCBC			= true; /** will get set -if at all- by xxxx **/
	this.doBulkPrint	= false;
	
	var location		= WPS.getNodeTextContent(cfg.selectSingleNode(CaseManWPXPath.OutputLocation));
	var finalLocaton	= WPS.getNodeTextContent(cfg.selectSingleNode(CaseManWPXPath.OutputFinalLocation));
	if ( location == finalLocaton ) {
		this.finalOutput = false;
	}
	else {
		this.finalOutput = true;
	}
	
	/**
	 * Providing for default values here -- avoiding every output needing this info in the config xml
	 */
	this.doDuplex       = WPS.getNodeTextContent(cfg.selectSingleNode(CaseManWPXPath.OutputDuplex));
	if (null == this.doDuplex || "" == this.doDuplex) this.doDuplex = WPFR.TMP_POPT_DUPL;
	/**
	 * Providing for default values here -- avoiding every output needing this info in the config xml
	 */	
	this.doPrintTray	= WPS.getNodeTextContent(cfg.selectSingleNode(CaseManWPXPath.OutputTray)); 
	if (null == this.doPrintTray || "" == this.doPrintTray) this.doPrintTray = WPFR.TMP_POPT_TRAY;
	/**
	 * Providing for default values here -- avoiding every output needing this info in the config xml
	 */
	this.doPrintCopies	= WPS.getNodeTextContent(cfg.selectSingleNode(CaseManWPXPath.OutputCopies)); 
	if (null == this.doPrintCopies || "" == this.doPrintCopies) this.doPrintCopies = WPFR.TMP_POPT_NOCO; }
	
/**
 * SUPS CaseMan Word Processing Output - toString implementation. 
 * @type String
 * @returns String 'CaseManWPOutput (cjr/n/desc)'
 */
CaseManWPOutput.prototype.toString = function() {
	var idStr = "";
	idStr += null == this.refCJR ? "No CJR" : this.refCJR;
	idStr += null == this.refN ? "" : ("," +this.refN);
	idStr += null == this.refDescription ? "No Description" : (", "+this.refDescription);
	return "CaseMan Output ("+idStr+")"; }

/**
 * SUPS CaseMan WP Output - get CJR Reference
 * @type String
 * @returns String representation of the CJR Reference of this Output
 */
CaseManWPOutput.prototype.getCJRReference = function() {
	return this.refCJR; }
/** 
 * SUPS CaseMan WP Output - get printDuplex
 * @type String
 * @returns String boolean indicating the use of duplex printing
 */	
CaseManWPOutput.prototype.getDuplexSetting = function() {
	return this.doDuplex; }

/** 
 * SUPS CaseMan WP Output - get print tray
 * @type String
 * @returns String indicating tray to print to
 */	
CaseManWPOutput.prototype.getTraySetting = function() {
	return this.doPrintTray; }

/** 
 * SUPS CaseMan WP Output - get print copies
 * @type String
 * @returns String indicating the number of copies to print
 */	
CaseManWPOutput.prototype.getCopiesSetting = function() {
	return this.doPrintCopies; }

/**
 * SUPS CaseMan WP Output - get CJR Reference
 * @type String
 * @returns String representation of the N Reference of this Output
 */
CaseManWPOutput.prototype.getNReference = function() {
	return this.refN; }

/**
 * SUPS CaseMan WP Output - get CJR Reference
 * @type String
 * @returns String representation of the decsription of this Output
 */
CaseManWPOutput.prototype.getDescription = function() {
	return this.refDescription; }
	
/**
 * SUPS CaseMan WP Output - get Final Output indicator
 * @type String
 * @returns boolean indicating if the output has a different template if marked as final
 */
CaseManWPOutput.prototype.getFinalOutput = function() {
	return this.finalOutput; }

/**
 * SUPS CaseMan WP Output - Does this output require a QA screen in its production process? 
 * @type boolean
 * @returns boolean indicating whether or not to load a QA screen when producing this output.
 */
CaseManWPOutput.prototype.getDoQA = function() {
	return this.doQA; }
	
/**
 * SUPS CaseMan WP Output - Set wether this output requires a QA screen in its production process
 * used by the logic to skip QA when reruning creation of output 
 * [see CaseManWPProcessStep__LoadQA.prototype.process = function(wpctrl, wpprocess) ]
 * @type boolean
 * @returns boolean indicating whether or not to load a QA screen when producing this output.
 */
CaseManWPOutput.prototype.setDoQA = function(boolean) {
	this.doQA = boolean; }

/**
 * SUPS CaseMan WP Output - 
 * @type boolean
 * @returns boolean 
 */
CaseManWPOutput.prototype.getDoCCBC = function() {
	return this.doCCBC; }
	
/**
 * SUPS CaseMan WP Output - 
 * @type boolean
 * @returns boolean 
 */
CaseManWPOutput.prototype.setDoCCBC = function(boolean) {
	this.doCCBC = boolean; }
	
/**
 * SUPS CaseMan WP Output - returns whether output is being sent for bulk printing
 * @type boolean
 * @returns boolean 
 */
CaseManWPOutput.prototype.getDoBulkPrint = function() {
	return this.doBulkPrint; }
	
/**
 * SUPS CaseMan WP Output - sets the bulk printing attribute
 * @type boolean
 * @returns boolean 
 */
CaseManWPOutput.prototype.setDoBulkPrint = function(boolean) {
	this.doBulkPrint = boolean; }	
	
/**
 * SUPS CaseMan WP Output - Does this output require a WP Editor screen in its production process? 
 * @type boolean
 * @returns boolean indicating whether or not to load a WP screen when producing this output.
 */
CaseManWPOutput.prototype.getDoWP = function() {
	return this.doWP; }
	
/**
 * SUPS CaseMan WP Output - Does this output require a data reload after the qa screen is saved?
 * @type boolean
 * @returns boolean indicating whether or not to <u>re</u>load the data when producing this output.
 */
CaseManWPOutput.prototype.getDoReload = function() {
	return this.doReload; }
	
/**
 * SUPS CaseMan WP Output - Does this output use an alternative process
 */
CaseManWPOutput.prototype.getAltProcess = function() {
	return this.altProcess; }
