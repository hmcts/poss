/**
 * CaseMan Word Processing XPath
 * Assistant class for XPaths in Word Processing.
 * The values of the XPaths are not hard coded - rather parsed from the
 * wpctrl configuration xml.
 *
 * The JavaScript code making up the 'Word Processing Controller' MUST NOT have
 * ANY hardcoded xpaths!
 *
 * Instead, the xpaht msust be put in the ctrl xml,
 *
 * Change History
 * 28/01/2013 - Chris Vincent: Added new variables for the case track xpath  Trac 4763.
 * @constructor
 */
function CaseManWPXPath(ref, xpath) {
	WPXPath.apply(this, [ref, xpath]);
}

/**
 * CaseMan Word Processing XPath - Object Orientation - setting superclass.
 */
CaseManWPXPath.prototype =  new WPXPath();

/**
 * CaseMan Word Processing XPath - Object Orientation - setting constructor.
 */
CaseManWPXPath.prototype.constructor = CaseManWPXPath;
 
/**
 * CaseMan Word Processing XPath - Class Initialisation.
 * This function is invoked ONLY by the WPXPath super class initialisation!
 * @argument wpctrl WordProcessingController instance
 */

CaseManWPXPath.Initialize = function(wpctrl) {
	var xps = [ "CaseManWPXPath.URLXSLFOPDFCreation",
				"CaseManWPXPath.URLPDFCreation",
				"CaseManWPXPath.Request",
				"CaseManWPXPath.FinalFlag",
				"CaseManWPXPath.dsDOM_ManageCase",
				"CaseManWPXPath.dsDOM_CaseNumber",
				"CaseManWPXPath.dsDOM_CaseParties",
				
				"CaseManWPXPath.CaseNumber",
				"CaseManWPXPath.CaseType",
				"CaseManWPXPath.TransferReason",
				"CaseManWPXPath.EventStandardId",
				"CaseManWPXPath.EventPK",
				"CaseManWPXPath.ctxTrack",
				
				"CaseManWPXPath.COEventStandardId",
				"CaseManWPXPath.COEventPK",
				"CaseManWPXPath.COEventCode",
				"CaseManWPXPath.CONumber",
				"CaseManWPXPath.AENumber",				
				"CaseManWPXPath.dsDOM_MaintainCO",
				"CaseManWPXPath.dsDOM_CONumber",
				"CaseManWPXPath.dsDOM_CODebtor",
				"CaseManWPXPath.dsDOM_CODebtorId",				
				"CaseManWPXPath.dsDOM_CODebtorName",				
				"CaseManWPXPath.dsDOM_COEmployer",
				"CaseManWPXPath.dsDOM_COEmployerId",				
				"CaseManWPXPath.dsDOM_COEmployerName",				
				"CaseManWPXPath.dsDOM_COCreditor",
				"CaseManWPXPath.dsDOM_MaintainWarrant",
				"CaseManWPXPath.dsDOM_WarrantNumber",
				"CaseManWPXPath.dsDOM_WarrantCaseNumber",
				"CaseManWPXPath.dsDOM_WarrantClaimant",
				"CaseManWPXPath.dsDOM_WarrantClaimantName",
				"CaseManWPXPath.dsDOM_WarrantClaimantId",
				"CaseManWPXPath.dsDOM_WarrantDefendant1",
				"CaseManWPXPath.dsDOM_WarrantDefendant1Name",
				"CaseManWPXPath.dsDOM_WarrantDefendant1Id",
				"CaseManWPXPath.dsDOM_WarrantDefendant2",
				"CaseManWPXPath.dsDOM_WarrantDefendant2Name",
				"CaseManWPXPath.dsDOM_WarrantDefendant2Id",
		
				"CaseManWPXPath.FindOutputForEvent",
				"CaseManWPXPath.FindOutputForEventAndCode",	
				"CaseManWPXPath.FindOutputForEventAndCaseType",							
				"CaseManWPXPath.FindOutputWithId",
				"CaseManWPXPath.FindEventOutputCreationCondition",
				"CaseManWPXPath.FindFormWithRef",
				"CaseManWPXPath.OutputCJR",
				"CaseManWPXPath.OutputN",
				"CaseManWPXPath.OutputDescription",
				"CaseManWPXPath.OutputLocation",
				"CaseManWPXPath.OutputFinalLocation",
				"CaseManWPXPath.OutputQA",
				"CaseManWPXPath.OutputWP",
				"CaseManWPXPath.OutputReload",
				"CaseManWPXPath.AltProcess", 
				"CaseManWPXPath.OutputDuplex",
				"CaseManWPXPath.OutputTray",
				"CaseManWPXPath.OutputCopies",
				"CaseManWPXPath.OutputServerIDAfterCreation",
				
				"CaseManWPXPath.ProgressBar",
				"CaseManWPXPath.defaultPrinter",
				"CaseManWPXPath.FAPServer",

				"CaseManWPXPath.ctxApplicantParty",
				"CaseManWPXPath.ctxJudgmentId",
				
				"CaseManWPXPath.ctxCaseNo",
				"CaseManWPXPath.ctxCoNo",
				"CaseManWPXPath.ctxStdEvtId",
				"CaseManWPXPath.ctxWPOutputId",
				"CaseManWPXPath.DebtSequence",
				"CaseManWPXPath.ProgressBar"  ]
	/** upon returning true, the above elements (refering to the static attribs of this class) of the xps array 			
		will be populated with the values found in the wpctrl.xml **/
		
	var result1 = WPXPath.ParseConfigurationXPaths(wpctrl, xps, "CaseManWPXPath");
	/** 
	upon returning true, CaseManWPXPath.NEW_contextXML will contain a dom representing an empty context xml
		against which any incomming context xml from the WP.Process api can be checked. 
		**/
	var result2 = WPXPath.ParseConfigurationContext(wpctrl, "NEW_contextXML", "CaseManWPXPath");
	return (result1 && result2); }


CaseManWPXPath.ctxJudgmentId = null;

CaseManWPXPath.ctxApplicantParty = null;

CaseManWPXPath.ctxTrack = null;

CaseManWPXPath.ctxWPOutputId = null

CaseManWPXPath.defaultPrinter = null;

CaseManWPXPath.FAPServer = null;

/**
 * - refer to ths use of this url, how it needs to be configured.
 */
CaseManWPXPath.URLXSLFOPDFCreation = null;
/**
 * -- rename to something regarding the save data return dom - output pk after creation
 */
CaseManWPXPath.OutputServerIDAfterCreation = null;

/**
 * CaseMan Word Processing XPath - URLPDFCreation.
 * This ''XPath'' identifies URL to be used for PDF Creation
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.URLPDFCreation = null;

/**
 * CaseMan Word Processing XPath - Request.
 * This XPath identifies the requested process in the xml passed through the WP API
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.Request = null;

/**
 * CaseMan Word Processing XPath - CONumber.
 * This XPath identifies the Consolidated order Number in the xml passed through the WP API
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.CONumber = null;

/**
 * CaseMan Word Processing XPath - AENumber.
 * This XPath identifies the AE order Number in the xml passed through the WP API
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.AENumber = null;


/**
 * CaseMan Word Processing XPath - CONumber.
 * This XPath identifies the Consolidated order Number in the ds dom xml 
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_MaintainCO = null;

/**
 * CaseMan Word Processing XPath - CONumber.
 * This XPath identifies the Consolidated order Number in the ds dom xml (rel. to dsDOM_MaintainCO)
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_CONumber = null;

/**
 * CaseMan Word Processing XPath - CONumber.
 * This XPath identifies the Consolidated order Parties in the ds dom xml (rel. to dsDOM_MaintainCO)
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_CODebtor = null;

/**
 * CaseMan Word Processing XPath - CONumber.
 * This XPath identifies the Consolidated order Parties in the ds dom xml (rel. to dsDOM_MaintainCO)
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_CODebtorId = null;

/**
 * CaseMan Word Processing XPath - CONumber.
 * This XPath identifies the Consolidated order Parties in the ds dom xml (rel. to dsDOM_MaintainCO)
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_CODebtorName = null;

/**
 * CaseMan Word Processing XPath - CO Employer.
 * This XPath identifies the Consolidated order Parties in the ds dom xml (rel. to dsDOM_MaintainCO)
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_COEmployer = null;

/**
 * CaseMan Word Processing XPath - CO Employer id.
 * This XPath identifies the Consolidated order Parties in the ds dom xml (rel. to dsDOM_MaintainCO)
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_COEmployerId = null;

/**
 * CaseMan Word Processing XPath - Employer Name.
 * This XPath identifies the Consolidated order Parties in the ds dom xml (rel. to dsDOM_MaintainCO)
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_COEmployerName = null;

/**
 * CaseMan Word Processing XPath - CONumber.
 * This XPath identifies the Consolidated order Parties in the ds dom xml (rel. to dsDOM_MaintainCO)
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_COCreditor = null;

/**
 * CaseMan Word Processing XPath - COEventStandardId
 * This XPath identifies the Consolidated Order Standard Event Id  in the xml passed through the WP API
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.COEventStandardId = null;

/**
 * CaseMan Word Processing XPath - COEventPK
 * This XPath identifies the Consolidated Event PK in the xml passed through the WP API
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.COEventPk = null;

/**
 * CaseMan Word Processing XPath - COEventCode 
 * This XPath identifies the Consolidated Event Code in the xml passed through the WP API
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.COEventCode = null;

/**
 * CaseMan Word Processing XPath - CaseNumber.
 * This XPath identifies the ManageCase in the dsDOM xml 
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_ManageCase= null;

/**
 * CaseMan Word Processing XPath - CaseNumber.
 * This XPath identifies the Case Number in the dsDOM xml 
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_CaseNumber = null;

/**
 * CaseMan Word Processing XPath - CaseNumber.
 * This XPath identifies the Case Parties in the dsDOM xml 
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_CaseParties = null;

/**
 * CaseMan Word Processing XPath - Warrant.
 * This XPath identifies the MaintainWarrant node in the dsDOM xml 
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_MaintainWarrant = null;

/**
 * CaseMan Word Processing XPath - Warrant Details.
 * This XPath identifies the warrant detail in the dsDOM xml 
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_WarrantNumber = null;

/**
 * CaseMan Word Processing XPath - Warrant Case Number Details.
 * This XPath identifies the warrant detail in the dsDOM xml 
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_WarrantCaseNumber = null;

/**
 * CaseMan Word Processing XPath - Warrant Details.
 * This XPath identifies the warrant detail in the dsDOM xml 
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_WarrantClaimant = null;

/**
 * CaseMan Word Processing XPath - Warrant Details.
 * This XPath identifies the warrant detail in the dsDOM xml 
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_WarrantClaimantName = null;

/**
 * CaseMan Word Processing XPath - Warrant Details.
 * This XPath identifies the warrant detail in the dsDOM xml 
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_WarrantClaimantId = null;

/**
 * CaseMan Word Processing XPath - Warrant Details.
 * This XPath identifies the warrant detail in the dsDOM xml 
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_WarrantDefendant1 = null;

/**
 * CaseMan Word Processing XPath - Warrant Details.
 * This XPath identifies the warrant detail in the dsDOM xml 
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_WarrantDefendant1Name = null;

/**
 * CaseMan Word Processing XPath - Warrant Details.
 * This XPath identifies the warrant detail in the dsDOM xml 
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_WarrantDefendant1Id = null;

/**
 * CaseMan Word Processing XPath - Warrant Details.
 * This XPath identifies the warrant detail in the dsDOM xml 
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_WarrantDefendant2 = null;

/**
 * CaseMan Word Processing XPath - Warrant Details.
 * This XPath identifies the warrant detail in the dsDOM xml 
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_WarrantDefendant2Name = null;

/**
 * CaseMan Word Processing XPath - Warrant Details.
 * This XPath identifies the warrant detail in the dsDOM xml 
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.dsDOM_WarrantDefendant2Id = null;
		
/**
 * CaseMan Word Processing XPath - CaseNumber.
 * This XPath identifies the Case Number in the xml passed through the WP API
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.CaseNumber = null;

/**
 * CaseMan Word Processing XPath - CaseType
 * This XPath identifies the Case Type in the xml passed through the WP API
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.CaseType = null;

/**
 * CaseMan Word Processing XPath - TransferReason
 * This XPath identifies the Case Type in the xml passed through the WP API
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.TransferReason = null;

/**
 * CaseMan Word Processing XPath - EventStandardId
 * This XPath identifies the Standard Event Id  in the xml passed through the WP API
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.EventStandardId = null;

/**
 * CaseMan Word Processing XPath - EventPK
 * This XPath identifies the Event PK in the xml passed through the WP API
 * (e.g. process() function)
 * @type String
 */
CaseManWPXPath.EventPk = null;

/**
 * CaseMan Word Processing XPath - how to find the output id of a known standard event id
 * This XPath identifies the output in the config xml based on the event argument passed in
 * @type String
 */
CaseManWPXPath.FindOutputForEvent = null;


/**
 * CaseMan Word Processing XPath - how to find the output id of a known standard event id and event code
 * This XPath identifies the output in the config xml based on the event arguments passed in
 * @type String
 */
CaseManWPXPath.FindOutputForEventAndCde = null;


/**
 * CaseMan Word Processing XPath - how to find the output id of a known standard event id and event code
 * This XPath identifies the output in the config xml based on the event arguments passed in
 * @type String
 */
CaseManWPXPath.FindOutputForEventAndCode = null;


/**
 * CaseMan Word Processing XPath - how to find the output id of a known standard event id and case type
 * This XPath identifies the output in the config xml based on the event arguments passed in
 * @type String
 */
CaseManWPXPath.FindOutputForEventAndCaseType = null;


/**
 * CaseMan Word Processing XPath - how to find the output id of a known standard event id
 * This function identifies the XPath that identifies the output in the config xml based on the event argument passed in
 * @type String
 * @returns String
 */
CaseManWPXPath._FindOutputForEvent = function(arg1) {

	var str = CaseManWPXPath.FindOutputForEvent;
	if (str != null) {
		var qIdx = str.indexOf("?");
		str = str.substring(0, qIdx) + arg1 + str.substring(qIdx + 1, str.length); }
	return str; }

/**
 * CaseMan Word Processing XPath - how to find the output id of a known standard event id and code
 * This function identifies the XPath that identifies the output in the config xml based on the event argument passed in
 * @type String
 * @argument arg1 standardeventid
 * @argument arg2 event code
 * @returns String
 */
CaseManWPXPath._FindOutputForEventAndCode = function(arg1, arg2) {
	var str = CaseManWPXPath.FindOutputForEventAndCode;
	if (str != null) {
		var qIdx = str.indexOf("?");
		str = str.substring(0, qIdx) + arg1 + str.substring(qIdx + 1, str.length);

		qIdx = str.indexOf("?");
		str = str.substring(0, qIdx) + arg2 + str.substring(qIdx + 1, str.length); }
		
	return str; }

/**
 * CaseMan Word Processing XPath - how to find the output id of a known standard event id and case type
 * This handles the situation for case event 1, which creates different outputs based upon case type
 * This function identifies the XPath that identifies the output in the config xml based on the event argument passed in
 * @type String
 * @argument arg1 standardeventid
 * @argument arg2 case type
 * @returns String
 */
CaseManWPXPath._FindOutputForEventAndCaseType = function(arg1, arg2) {
	var str = CaseManWPXPath.FindOutputForEventAndCaseType;
	if (str != null) {
		var qIdx = str.indexOf("?");
		str = str.substring(0, qIdx) + arg1 + str.substring(qIdx + 1, str.length);

		qIdx = str.indexOf("?");
		str = str.substring(0, qIdx) + arg2 + str.substring(qIdx + 1, str.length); }
		
	return str; }

/**
 * CaseMan Word Processing XPath - How to find the (if any) condition for creating an event's outputs
 * @type String
 */
CaseManWPXPath.FindEventOutputCreationCondition = null;

/**
 * CaseMan Word Processing XPath - How to find the (if any) condition for creating an event's outputs
 * @argument eventId
 * @argument evendCode
 * @type String
 * @returns condition type string
 */
CaseManWPXPath._FindEventOutputCreationCondition = function(eventId, eventCode) {
	var str = CaseManWPXPath.FindEventOutputCreationCondition;
	if (str != null) {
		var qIdx = str.indexOf("?");
		str = str.substring(0, qIdx) + eventId + str.substring(qIdx + 1, str.length);

		qIdx = str.indexOf("?");
		str = str.substring(0, qIdx) + eventCode + str.substring(qIdx + 1, str.length); }
		
	return str; 

}

/**
 * CaseMan Word Processing XPath - How to find an output definition element with the output id
 * This XPath identifies the output in the config xml based on the event argument passed in
 * @type String
 */
CaseManWPXPath.FindOutputWithId = null;


/**
 * CaseMan Word Processing XPath - How to find an output definition element with the output id
 * This function identifies the xpaht to indentify the output in the config xml based on the event argument passed in
 * @type String
 * @returns String
 */
CaseManWPXPath._FindOutputWithId = function(id) {
	var str = CaseManWPXPath.FindOutputWithId;
	if (str != null) {
		var qIdx = str.indexOf("?");
		str = str.substring(0, qIdx) + "'" +id + "'" + str.substring(qIdx + 1, str.length);	}
	return str; }

/**
 * CaseMan Word Processing XPath - How to find an form mapping name for a reference 
 * (The reference being the hardcoded bit in javascript)
 * @type String
 */
CaseManWPXPath.FindFormWithRef = null;

/**
 * CaseMan Word Processing XPath - How to find a form mapping name 
 * This function identifies the xpaht to indentify the form mapping name in the config xml based on the form reference argument passed in
 * @type String
 * @returns String
 */
CaseManWPXPath._FindFormWithRef = function(id) {
	var str = CaseManWPXPath.FindFormWithRef;
	if (str != null) {
		var qIdx = str.indexOf("?");
		str = str.substring(0, qIdx) + "'" +id + "'" + str.substring(qIdx + 1, str.length);	}
	return str; 
}

/**
 * CaseMan Word Processing XPath - Locates the CJR reference node in an output element of the wpctrl config xml
 * @type String
 */
CaseManWPXPath.OutputCJR = null;

/**
 * CaseMan Word Processing XPath - Locates the N reference node in an output element of the wpctrl config xml
 * @type String
 */
CaseManWPXPath.OutputN = null;

/**
 * CaseMan Word Processing XPath - Locates the Description node in an output element of the wpctrl config xml
 * @type String
 */
CaseManWPXPath.OutputDescription = null;

/**
 * CaseMan Word Processing XPath - Locates the OutputLocation node in an output element of the wpctrl config xml
 * @type String
 */
CaseManWPXPath.OutputLocation = null;

/**
 * CaseMan Word Processing XPath - Locates the OutputFinalLocation node in an output element of the wpctrl config xml
 * @type String
 */
CaseManWPXPath.OutputFinalLocation = null;

/**
 * CaseMan Word Processing XPath - Locates the QA node in an output element of the wpctrl config xml
 * @type String
 */
CaseManWPXPath.OutputQA = null;

/**
 * CaseMan Word Processing XPath - Locates the WP node in an output element of the wpctrl config xml
 * @type String
 */
CaseManWPXPath.OutputWP = null;

/**
 * CaseMan Word Processing XPath - Locates the Reload node in an output element of the wpctrl config xml
 * @type String
 */
CaseManWPXPath.OutputReload = null;

/**
 * CaseMan Word Processing XPath - Locates the printDuplex node in an output element of the wpctrl config xml
 * @type String
 */
CaseManWPXPath.OutputDuplex = null;

/**
 * CaseMan Word Processing XPath - Locates the tray node in an output element of the wpctrl config xml
 * @type String
 */
CaseManWPXPath.OutputTray = null;
/**
 * CaseMan Word Processing XPath - Locates the copies node in an output element of the wpctrl config xml
 * @type String
 */
CaseManWPXPath.OutputCopies = null;


/**
 * CaseMan Word Processing XPath - Empty Context XML fragment 
 * The controller verifies the incomming xml against this structure.
 * @type String
 */
CaseManWPXPath.NEW_contextXML = null;

/**
 * CaseMan Word Processing XPath - Locates the Case Number in the Context XML fragment 
 * @type String
 */
CaseManWPXPath.ctxCaseNo = null;

/**
 * CaseMan Word Processing XPath - Locates the Consolidated Order Number in the Context XML fragment 
 * @type String
 */
CaseManWPXPath.ctxCoNo = null;

/**
 * CaseMan Word Processing XPath - Locates the StandardEventId in the Context XML fragment 
 * @type String
 */
CaseManWPXPath.ctxStdEvtId = null;


CaseManWPXPath.FinalFlag = null;



/**
 * CaseMan Word Processing XPath - Locates the DebtSequence in the Context XML fragment 
 * @type String
 */
CaseManWPXPath.DebtSequence = null;

/** 
 * CaseMan Word Processing XPath - Databinding of the progress indicator textfield on the caseman wp progress subform.
 */
CaseManWPXPath.ProgressBar =null;
