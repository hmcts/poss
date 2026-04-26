/**
 * This is the place for the revised QA Question - Framework functions.
 * 
 * Change History:
 * 07/02/2008 - Chris Vincent: CaseMan Defect 6502.  Updated loadCourt() and loadNonWorkingDays()
 * 				so they will only ever get called once when a WP Q&A screen loads.  Previously
 * 				some Q&A screens were calling getCourts three times when loading.
 * 12/12/2011 - Chris Vincent.  Added refdata call WPU.loadCourtShort() when only a list of Courts is required.  Trac 4621.
 * 25/06/2012 - Des Johnston. WPU.loadRepresentations() - added lines to filter out ampersands in Names .  Trac 3432.
 * 28/01/2013 - Chris Vincent.  RFS3719 changes (all Trac 4762):
 *				Added WPU.daysInFuture() to generate a date in the future.
 *				Change to WPU.GetHearingTypeToCreate to add a hearing type for new output CJR034.
 *				Change to validateCurrencyValue() to cater for new validation.
 */
function WPU() {}		

WPU.WP_REF_NODE = "/ds/var/ref/wp";

WPU.NODE_XPATHS = new Array();
WPU.NODE_XPATHS['CONumber'] = "/params/param/ds/MaintainCO/CONumber";  
WPU.NODE_XPATHS['Debtor'] 	= "/params/param/ds/MaintainCO/Debtor";
WPU.NODE_XPATHS['Employer'] = "/params/param/ds/MaintainCO/Employer";
WPU.NODE_XPATHS['Debts'] 	= "/params/param/ds/MaintainCO/Debts/Debt";
WPU.NODE_XPATHS['OwningCourtCode'] 	= "/params/param/ds/MaintainCO/OwningCourtCode";
WPU.NODE_XPATHS['OwningCourt'] 	= "/params/param/ds/MaintainCO/OwningCourt";
WPU.NODE_XPATHS['COType'] 	= "/params/param/ds/MaintainCO/COType";
WPU.NODE_XPATHS['COStatus'] 	= "/params/param/ds/MaintainCO/COStatus";
WPU.NODE_XPATHS['COEventSeq'] 	= "/params/param/COEventSeq";
WPU.NODE_XPATHS['Warrant'] = "/params/param/ds/Warrant";
WPU.NODE_XPATHS['CaseNumber'] = "/params/param/ds/ManageCase/CaseNumber"; 
WPU.NODE_XPATHS['TransferCase'] = "/params/param/transferxml/TransferCase";
WPU.NODE_XPATHS['CaseEventId'] = "/params/param/eventxml/CaseEvent/StandardEventId"; 
WPU.NODE_XPATHS['UserDefaultPrinter'] = "/params/param/UserDetails/ds/MaintainUser/DefaultPrinter";
WPU.NODE_XPATHS['UserTitle'] = "/params/param/UserDetails/ds/MaintainUser/Title";
WPU.NODE_XPATHS['UserForenames']=  "/params/param/UserDetails/ds/MaintainUser/Forenames";
WPU.NODE_XPATHS['UserSurname'] = "/params/param/UserDetails/ds/MaintainUser/Surname";
WPU.NODE_XPATHS['UserExtension'] = "/params/param/UserDetails/ds/MaintainUser/Extension";
WPU.NODE_XPATHS['UserSectionForPrintout'] = "/params/param/UserDetails/ds/MaintainUser/SectionForPrintouts";
WPU.NODE_XPATHS['AESubject'] = "/params/param/AE/AEEvent/EventDetails";
WPU.NODE_XPATHS['SubjectCasePartyNumber'] = "/params/param/eventxml/CaseEvent/SubjectCasePartyNumber";
WPU.NODE_XPATHS['SubjectPartyRoleCode'] = "/params/param/eventxml/CaseEvent/SubjectPartyRoleCode";
WPU.NODE_XPATHS['AEStandardEventId'] = "/params/param/AE/AEEvent/StandardEventId";
WPU.filterTextArea__SELECTXMLVERSION = "./xmlversion";
WPU.filterTextArea__SELECTSINGLETEXTNODE = "/*[text()][1]";


/**
 * Helper function for CJR043 QA screen initialisation
 */
WPU.loadJudgmentCJR043 = function() {
	var jId = null;
	var ctx = WP.GetScreenProcess().getRequest().getContext();
	var seqNode = ctx.selectSingleNode(top.CaseManWPXPath.ctxJudgmentId);
	if (null != seqNode) {
		jId = XML.getNodeTextContent(seqNode);
		if (null != jId) {
		var dsd = WPU._getDsDOM();
		var jNode = dsd.selectSingleNode("//Judgment[JudgmentId = "+ jId +"]");
		if (null == jNode) {
			alert("Judgment "+ jId +" not found - Can not update determination judgment"); }
		else {
			Services.setValue(JudgmentAmount.dataBinding, jNode.selectSingleNode("Amount").text );
			Services.setValue(DefaultCurrency38.dataBinding, jNode.selectSingleNode("AmountCurrency").text );
			Services.setValue(CostAmount.dataBinding, jNode.selectSingleNode("TotalCosts").text );
			Services.setValue(DefaultCurrency39.dataBinding,  WPS.__CaseManUtils().transformCurrencySymbolToModel(jNode.selectSingleNode("TotalCostsCurrency").text,null,null) );
			Services.setValue(PrePaid.dataBinding, jNode.selectSingleNode("PaidBefore").text );
			Services.setValue(DefaultCurrency40.dataBinding, jNode.selectSingleNode("PaidBeforeCurrency").text );
			Services.setValue(JudgmentForthwith.dataBinding, ('FW' == jNode.selectSingleNode("PeriodCode").text ? "Y" : "N"));
			Services.setValue(PaymentDate.dataBinding, 'FUL' == jNode.selectSingleNode("PeriodCode").text ? jNode.selectSingleNode("FirstPayDate").text : "");
			Services.setValue(InstalmentAmount.dataBinding, jNode.selectSingleNode("InstallAmount").text );
			Services.setValue(DefaultCurrency42.dataBinding, jNode.selectSingleNode("InstallAmountCurrency").text );
			Services.setValue(InstalmentPeriod.dataBinding, ('FUL' == jNode.selectSingleNode("PeriodCode").text ? "" : jNode.selectSingleNode("PeriodCode").text) );
			Services.setValue(InstalmentDate.dataBinding, 'FUL' == jNode.selectSingleNode("PeriodCode").text ? "" : jNode.selectSingleNode("FirstPayDate").text );
			Services.setValue(JudgmentOrderDate.dataBinding, jNode.selectSingleNode("Date").text );
			Services.setValue("/ds/EnterVariableData/Judgment/isregistered", ( "" == jNode.selectSingleNode("DateRTL").text ? "N" : "Y"));
			Services.setValue("/ds/EnterVariableData/Judgment/regDate", jNode.selectSingleNode("DateRTL").text);
			// UCT_Group2 Defect 1311 - include the Joint Judgment field existing value
			Services.setValue(JointJudgment.dataBinding, jNode.selectSingleNode("JointJudgment").text ); } } }
	else {
		alert("Can not find judgment id  - Can not update determination judgment."); }
	return null; }
 
/**
 *
 */
WPU.getUserDefaultPrinter = function() {
	var printer = null;
	var dsd = WPU._getDsDOM();
	var printerNode = dsd.selectSingleNode(WPU.NODE_XPATHS['UserDefaultPrinter']);
	if (null != printerNode) {
		printer = XML.getNodeTextContent(printerNode); }
	return printer; }

/**
 * Helper function fot QA Screens to retrieve the sequence of the debt selected on the add co event popup
 */
WPU.GetDebtSequence =function() {
	var seq = null;
	var ctx = WP.GetScreenProcess().getRequest().getContext();
	var seqNode = ctx.selectSingleNode(top.CaseManWPXPath.DebtSequence);
	seq = XML.getNodeTextContent(seqNode);
	return seq; }
	
/**
 * Helper function for QA Screens to retrieve the status of a debt in the ds_dom for a sequence.
 */
WPU.GetDebtStatus =function (DebtSequence)  {
	var status = null;
	var dsd = WPU._getDsDOM();
	var debtNode = dsd.selectSingleNode("params/param/DEBT/ds/MaintainCO/Debts/Debt[DebtSeq = '"+DebtSequence+"']/DebtStatus");
	status = XML.getNodeTextContent(debtNode);
	return status; }
	
/**
 * Helper function for QA Screens to retrieve  a debt in the ds_dom for a sequence.
 */
WPU.GetDebtNode =function (DebtSequence)  {
	var status = null;
	var dsd = WPU._getDsDOM();
	var debtNode = dsd.selectSingleNode("params/param/DEBT/ds/MaintainCO/Debts/Debt[DebtSeq = '"+DebtSequence+"']");
	return debtNode; }
	
WPU.GetDebtNodes =function ()  {
	var dsd = WPU._getDsDOM();
	var debtNodes = dsd.selectNodes("params/param/DEBT/ds/MaintainCO/Debts/Debt");
	return debtNodes; }

WPU.createCreditorList = function()  {
	var nodes = WPU.GetDebtNodes();
	for(var i = 0; i <nodes.length; i++) {
		var node = nodes[i];
		Services.addNode(node.selectSingleNode("Creditor"), REF_DATA_XPATH + "/Creditors");	} }

WPU.GetCreditorPartyNodes =function ()  {
	var dsd = WPU._getDsDOM();
	var creditorPartyNodes = dsd.selectNodes("//Parties/LitigiousParty[TypeCode = 'CREDITOR']");
	return creditorPartyNodes; }

WPU.createCreditorPartyList = function()  {
	var nodes = WPU.GetCreditorPartyNodes();
	for(var i = 0; i <nodes.length; i++) {
		var node = nodes[i];
		Services.addNode(node, REF_DATA_XPATH + "/Creditors");	} }

WPU.getJudgmentNodes =function ()  {
	var dsd = WPU._getDsDOM();
	var jNodes = dsd.selectNodes("params/param/judgementxml/ds/MaintainJudgment/Judgments/Judgment");
	return jNodes; 	}

WPU.createJudgmentList = function()  {
	var nodes = WPU.getJudgmentNodes();
	for(var i = 0; i<nodes.length; i++) {
		var node = nodes[i];
		Services.addNode((node), REF_DATA_XPATH + "/Judgments" ); } }

WPU.createCaseList = function() {
	var nodes = WPU.GetDebtNodes();
	for(var i=0; i<nodes.length; i++) {
		var node = nodes[i];
		Services.addNode(node.selectSingleNode("DebtCaseNumber"), REF_DATA_XPATH + "/DebtCaseNumbers");	} }

/**
 * Helper function for QA Screens to retrieve the status of a debt in the ds_dom for a sequence.
 */
WPU.GetCOStatus =function ()  {
	var status = null;
	var dsd = WPU._getDsDOM();
	var coNode = dsd.selectSingleNode("params/param/ds/MaintainCO/COStatus");
	status = XML.getNodeTextContent(coNode);
	return status; }

/**
 * WP Interface for QA Screens to retrieve the users' application user name
 * @type String
 * @returns the username of the currently logged on user. (anonymous if not logged on)
 * old implementation (pre-security)
 * //CaseManUtils.getUserParameter(CaseManFormParameters.USERNAME_XPATH, "DEFAULT_USER"); 
 */
WPU.getUserName = function() {
	return WPS.__CaseManUtils().getUserParameter(WPS.__CaseManFormParameters().USERNAME_XPATH, "anonymous"); }

/**
 * WP Interface to retrieve the users' name, as in the name to be used for correspondence.
 * For now, linked to with stub logon, must become framework 7.1 security
 * @type String
 * @returns the print version of the username of the currently logged on user. (anonymous if not logged on)
 */
WPU.getUserPrintName = function() {
	return WPS.__CaseManUtils().getUserParameter(WPS.__CaseManFormParameters().USERNAME_XPATH, "anonymous"); }

/**
 * WP Interface to retrieve the users' home court
 * For now, linked to with stub logon, must become framework 7.1 security
 */
WPU.getHomeCourtCode = function() {
	return WPS.__CaseManUtils().getUserParameter(WPS.__CaseManFormParameters().COURTNUMBER_XPATH, 111);  }
	
/**
 * WP Interface to retrieve the users' Role 
 */
WPU.getUserRoles = function() {	
	return WPS.__Services().getNode("/ds/var/app/roles"); }

/**
 * WP Interface to obtain the users full name.
 */
WPU.getUserFullname = function() {
	
	var utitle = WPU.getValue( WPU.NODE_XPATHS['UserTitle']);
	
	
	var fullname =  WPU.getValue(WPU.NODE_XPATHS['UserForenames']) + " " 
					+ WPU.getValue(WPU.NODE_XPATHS['UserSurname']);					
					
	if( null != utitle )
	{	fullname = utitle + " " + fullname;
	}
	
	return fullname;
		
}

/**
 * WP Interface to retrieve the users' court section
 * For now, linked to with stub logon, must become framework 7.1 security
 */
WPU.getCourtSection = function() {  
  return WPU.getValue(WPU.NODE_XPATHS['UserSectionForPrintout']); }

/**
 * WP Interface to retrieve the users' telephone number
 * For now, linked to with stub logon, must become framework 7.1 security
 */
WPU.getUserTelephoneNumber = function() {   
	return WPU.getValue(WPU.NODE_XPATHS['UserExtension']); }
	
/**
 * WP Interface to retrieve the system date. Returns the data in the SERVER FORMAT.
 * system date is NOT calculated clientside, though retrieved from the systemDate webservice.
 * @@TODO@@ consume the webservice date rather than the users pc date.
 */
WPU.getSystemDate = function() {
	return WPS.__CaseManUtils().convertDateToPattern(new Date(), "YYYY-MM-DD"); }

/**
 * WP Interface to retrieve a date X number of days in the future
 */
WPU.daysInFuture = function(days, weekend) {
	var futureDate = WPS.__CaseManUtils().daysInFuture(new Date(), days, weekend);
	return WPS.__CaseManUtils().convertDateToPattern(futureDate, "YYYY-MM-DD") }

/** 
 * returns the PK of the Co Event created
 */
WPU.getCOEventSequence = function() {
	return WPU.getValue( WPU.NODE_XPATHS['COEventSeq'] ); }

/** 
 * returns the standard id of the Co Event created
 */
WPU.getCOEventId = function() {	
     var eventSeq = WPU.getCOEventSequence();
	 var xpathQ = "/params/param/COES/ManageCOEvents/COEvents/COEvent[./COEventSeq='"+eventSeq+"']/StandardEventId";
	 return WPU.getValue(xpathQ);	}

/**
 * Returns the COEvent xml from the DS_DOM (from the getCoEventList service)
 */
WPU.getCOEventNode = function(eventSequence) {
	var xpathQ = "/params/param/COES/ManageCOEvents/COEvents/COEvent[./COEventSeq='"+eventSequence+"']";
	return WPU.getNode(xpathQ); }
	
/**
 *
 */
WPU.getCOHearingParties = function() {
    if( false == Services.exists("/ds/EnterVariableData/COParties")) {
    	WPU.initialiseCOParties(); }	  
	return Services.getNodes("/ds/EnterVariableData/COParties/COParty"); }

WPU.initialiseCOParties = function() {	
	var dsDom = WPU._getDsDOM();
	var debtorNode = WPU.getSingleNode( WPU.NODE_XPATHS['Debtor'], dsDom );
	var emplNode = WPU.getSingleNode( WPU.NODE_XPATHS['Employer'], dsDom);
	var debts = WPU.getNodes( WPU.NODE_XPATHS['Debts'], dsDom);		
	var partyDom = XML.createDOM();	
	partyDom.loadXML("<COParty><Name /><TypeCode /><Number /></COParty>");
		
	if( null != debtorNode )
	{	var aParty = partyDom.cloneNode(true);
		var name =  WPU.getValue("./DebtorName", debtorNode);
		var type = WPU.getValue("./Type", debtorNode);
		var number = 1;//WPU.getValue("./PartyId", debtorNode);
		
		if( null != name && name.length > 0)
		{	XML.setElementTextContent( aParty, "./COParty/Name" , name);
			XML.setElementTextContent( aParty, "./COParty/TypeCode", type);
			XML.setElementTextContent( aParty, "./COParty/Number", number);
			Services.addNode(aParty, "/ds/EnterVariableData/COParties");
		}
	}
	
	
	if( null != emplNode )
	{  	var bParty = partyDom.cloneNode(true);
		var name =  WPU.getValue("./Name", emplNode);				
		var type = "Employer";
		var number = 1;// WPU.getValue("./PartyId", emplNode);
				
		if( null != name && name.length > 0)
		{	XML.setElementTextContent( bParty, "./COParty/Name", name );
			XML.setElementTextContent( bParty, "./COParty/TypeCode", type );
			XML.setElementTextContent( bParty, "./COParty/Number", number );
			Services.addNode(bParty, "/ds/EnterVariableData/COParties");
		}
	}
	
	if( null != debts && debts.length > 0 )
	{	for( var i = 0; i < debts.length; i++)
		{	var debtNode = debts[i];
			var credParty = partyDom.cloneNode(true);
			var name = WPU.getValue("./Creditor/Name", debtNode);
			var type = WPU.getValue("./Creditor/Type", debtNode);
			var number = (i + 1)//WPU.getValue("./Creditor/PartyId", debtNode );
						
			if( null != name && name.length > 0)
			{	XML.setElementTextContent( credParty, "./COParty/Name", name );
				XML.setElementTextContent( credParty, "./COParty/TypeCode", type );
				XML.setElementTextContent( credParty, "./COParty/Number", number );
				Services.addNode(credParty, "/ds/EnterVariableData/COParties");				
			}
		}
	}	
}

/**
 *
 */
WPU.addThToValue = function(th_value) {
	var dispValue = null;
	if(th_value != null) {
		dispValue = th_value + 'th';
		return dispValue; }
	return dispValue; }

/** 
 * This assumes the case event data was read successfully,
 * otherwise, returning an empty string / date
 */
WPU.getEventReceiptDate = function() {
	var erDate = null;
	var dsd = WPU._getDsDOM();
	var erdateNode = dsd.selectSingleNode("params/param/eventxml/CaseEvent/ReceiptDate");
	if (null != erdateNode) {
		erDate = XML.getNodeTextContent(erdateNode); }
	else {
		erDate = ""; }
	return erDate;	}

/** 
 * This assumes the warrant return date was read successfully,
 * otherwise, returning an empty string / date
 */
WPU.getWarrantReturnDate = function() {
	var erDate = null;
	var dsd = WPU._getDsDOM();
	var erdateNode = dsd.selectSingleNode("/params/param/WarrantEvent/ReceiptDate");
	if (null != erdateNode) {
		erDate = XML.getNodeTextContent(erdateNode); }
	else {
		erDate = ""; }
	return erDate;	}


/**
*@param aDom
*@param clone true/false
*/

WPU.getSubjectPartyNode = function(aDOM, clone  )
{
	var partyTypeCode = Services.getValue("//CaseEvent/SubjectPartyRoleCode");
	var partyNumber   = Services.getValue("//CaseEvent/SubjectCasePartyNumber");	
	var partyXPath    = "/Parties/LitigiousParty[TypeCode = '"+partyTypeCode+"' and Number = '"+partyNumber+"']";	
	if( clone )
	{ 	
		if( null != aDOM )
		{  
		return aDOM.selectSingleNode( partyXPath ).cloneNode( clone ); 
		}
	}

	if( null != aDOM )
	{  
		return aDOM.selectSingleNode( partyXPath );									
	}
	return Services.getNode( "//ManageCase"+partyXPath );		
}

WPU.getCurrentCaseData = function() 
{   var newDOM = XML.createDOM();
	return caseXML = Services.getNode("/ds/ManageCase");
//	if(null != caseXML) return WPS.getNodeTextContent( caseXML );
//	return "";
}


/**
* Generic function used to compare if an eventId is equal to a specific ID
* this function will return true if equality is established.
* It will normally calculate the eventId of the event which is 
* generating this Q&A screen, and then compare that eventId to a developer specified
* eventId. 
*
* @param comparativeEvent The eventId used to compare event IDs
**/
WPU.calculateEventEnablement = function (comparativeEvent){
	if (null != WP && null != WP.GetScreenProcess && null != WP.GetScreenProcess()) { 
	    currentProcessingEventId = WP.GetScreenProcess().getEvent();
	    currentProcessingEventFlag = false;
	    if(currentProcessingEventId == comparativeEvent ){
	        currentProcessingEventFlag = true;
	    }
	    return currentProcessingEventFlag; }
	else {
		return true; } }

/**
 * Get Value on xpath from aDom, or DSdom when aDom null
 */
WPU.getValue = function( xpath, aDom ) {
	if( null == aDom ){aDom = WPU._getDsDOM();}	 	
	var aNode = aDom.selectSingleNode( xpath );
	if( null != aNode )	return WPS.getNodeTextContent( aNode );
	return ""; }

/**
 * Get clone of (single!) Node on xpath from aDom, or DSdom when aDom null
 */
WPU.getNode = function( xpath, aDom ) {
	if( null == aDom ){aDom = WPU._getDsDOM();}	 	
	var aNode = aDom.selectSingleNode( xpath );
	if (null!= aNode) aNode = aNode.cloneNode(true);
	return aNode; }

/**
 * Get single Node on xpath from aDom, or DSdom when aDom null
 */
WPU.getSingleNode = function( xpath, aDom ) {	
	if( null == aDom ){aDom = WPU._getDsDOM();}
	return aDom.selectSingleNode( xpath ); }

/**
 * Get Nodes on xpath from aDom, or DSdom when aDom null
 */
WPU.getNodes = function( xpath, aDom ) {
	if( null == aDom ){aDom = WPU._getDsDOM();}
	return aDom.selectNodes( xpath ); }

/**
 * Helper function for QA screens to get access to the ds_dom
 */
WPU._getDsDOM = function() {	
	return WP.GetState(WP.GetScreenProcess(), WPState.ds_DOM); }

/**
 * WP Interface to retrieve the owing court of the case for which evd screen is showing.
 */
WPU.getCaseOwningCourt = function() {
	var str = "";
	var nod = Services.getNode("/ds/ManageCase/OwningCourtCode");
	if (null != nod) {
		str = XML.getNodeTextContent(nod); }
	else {
		str = WPU.getValue( WPU.NODE_XPATHS['OwningCourtCode']); }			
	return str; }	

/**
 * WP Interface to retrieve the court associated with the event.
 */
WPU.getCaseEventCourtCode = function() {
    var courtCode = "";
	var dsd = WPU._getDsDOM();
	var selectNode = dsd.selectSingleNode("//CaseEvent/CourtCode");
	courtCode = XML.getNodeTextContent(selectNode); 
	return courtCode; 
}

/**
 *
 */
WPU.getRaisingEventReceiptDate = function() {
	var str = "";
	var nod = Services.getNode("/ds/CaseEvent/ReceiptDate");
	if (null != nod) {
		str = XML.getNodeTextContent(nod); }
	else {	
		var xpath = "/params/param/COES/ManageCOEvents/COEvents/COEvent[./COEventSeq = /params/param/COEventSeq]/ReceiptDate";
		str = this.getValue(xpath); }	
	return str; }
  
/*
 *
 */
WPU.GetHearingTypeToCreate = function(process, arg) {
	var str = "GEN APPN";

	var output = process.getOutput().getCJRReference();  
	
	if( 'CJR023C' == output || 'CJR023A' == output) str = 'SMALL CLAIM';
	else if ('CJR023D' == output) str = 'PRELIM HEARING';
	else if( 'CJR083' == output) str = 'ORD FOR QUESTIONING';
	else if('CJR027' == output) str = 'GEN APPN';
	else if('CJR046' == output) str = 'TRIAL';
	else if( 'CJR072' == output || 'CJR073' == output ) str = "LISTING";
	else if( 'CJR019' == output) {
		if ("ALLOC" == arg)  {
			str = "ALLOC HEARING"; } 
		else if ("LIST" == arg) {
			str = "LISTING"; } }
	else if( 'CJR034' == output ){ str = 'TAXATION'; }
	else if( 'CJR020' == output || 'CJR060' == output){ str = 'FAST TRACK'; }
	else if( 'CJR080' == output ){ str = 'ORD FOR QUESTIONING'; } 
	else if( 'CJR091' == output ){ str = '3RD PARTY DEBT'; } 
	else if( 'CJR093' == output ){ str = 'CH ORDER'; }
	else if( 'CJR105' == output || 'CJR170' == output || 'CJR178' == output){ str = 'INTERLOC'; }
	else if( 'CJR177' == output ){ str = 'FUND'; }
	else if( 'CJR024' == output ){ str = arg; }
	else if( 'CJR028' == output ) { 
	         if( 'SCH' == arg ){ str = "SMALL CLAIM"; }
		else if( 'FTH' == arg ){ str = "FAST TRACK"; }
		else if( 'MTH' == arg ){ str = "MULTI TRACK"; }
		else if( 'DAH' == arg ){ str = "DISPOSAL/ASSESSMENT"; } }
	else if('CO02' == output) {
		arg = Services.getValue("/ds/EnterVariableData/ConfNotice/wording");
		if (arg == 'ADJ' || arg == 'RES') {	
			str = "ADJ/RES"; }
		else {
			str = "GEN HRG"; }	}	
	else if('CO09' == output) { str = "N62D"; }
	else if('CO10' == output) { str = "N62E"; }
	else if('CO21' == output) { str = "N66(H)";}
	else if('CO23' == output) { str = "N66(J)"; }	
	else if('CO32' == output) { str = "N95(F)";}	
	else if('CO34' == output) { str = "N95(H)";}	
	else if('CO35' == output) { str = "N95(I)";}		
	else if('CO37' == output) { str = "N118";}	
	else if('CO43' == output) { str = "N374";}	
	else if('O_10_2' == output) { str = "INSOLVENCY";}
	else if('O_10_3' == output) { str = "INSOLVENCY";}
	else if('O_10_4' == output) { str = "INSOLVENCY";}	
	else if('O_10_7' == output) { str = "INSOLVENCY";}
	else if('O_10_8' == output) { str = "INSOLVENCY";}
	else if('O_10_9' == output) { str = "INSOLVENCY";}	
	else if('O_10_11' == output) { str = "INSOLVENCY";}
	else if('O_10_13' == output) { str = "INSOLVENCY";}
	
	return str; }
	
/**
 *
 */
WPU.GetHearingTypeToCreateText = function(code) {
	var str = "General Application";
	
 	if ("PRELIM HEARING" == code) str = "Preliminary Hearing";
	else if ("TRIAL" == code) str = "Trial";
	else if ("LISTING" == code) str = "Listing Hearing";
	else if ("ALLOC HEARING" == code) str = "Allocation Hearing";
	
	if (do_D) alert("WPU.GetHearingTypeToCreate - " + code + " - " + str)
	
	return str; }
	    
/**
*
* Gets all the hearings associated with the current hearing i.e the hearing which 
* are contained within  this CaseNumber. This method should be called at initialization as it
* will repopulate the contents of the currently processing DOM. The parameter handlerTypeInUse defines the type of 
* hearingHandler to use, current types are "hearings" => Hearinghandler, "n63" => N63HearingHandler,"co" => COHearingHandler
*
*
**/ 
WPU.getCurrentCaseHearings = function(handlerTypeInUse){
       processingCaseNumber = WPU.getValue(WPU.NODE_XPATHS['CaseNumber'],null);
       if(handlerTypeInUse == "hearings"){
            loadHearing(processingCaseNumber);
       }
       else if(handlerTypeInUse == "n63"){
           loadN63Hearing(processingCaseNumber);    
       }
       
       else if(handlerTypeInUse == "co"){
           loadCOHearing(processingCaseNumber);
       }
       
       else if(handlerTypeInUse == "pastHearing"){
           loadPastHearings(processingCaseNumber);
       }
       else{}
}   

	
/**
 *
 * @type String
 * @argument WPRequest
 * @returns String indicating Judgment Type to be created for the WP Request / by the WP Request's QA Screen
 */
WPU.getJudgmentTypeToCreate = function(process) {
	var str = "DEFAULT";
	
	var evt = process.getEvent();
	
	if 		(240 == evt)	str = "ADMISSION";
	else if (250 == evt)	str = "DETERMINATION";
	else if (251 == evt)	str = "JUDGES";
	else if (253 == evt || 233 == evt)	str = "JUDGES";
	
	//alert("WPU.getJudgmentTypeToCreate  - evt : " +evt +" - returns : " +str);
	
	return str; 
}
	
WPU.getCasemapXML = function()
{
	var dom = XML.createDOM(null,null,null);
	
	dom.loadXML("<ds>"+
			"<MaintainHearing>"+
				"<CaseNumber />"+
				"<OwningCourtCode />"+
				"<OwningCourt />"+
				"<Parties>"+
					"<Party>"+
						"<PartyType />"+
						"<Number />"+
						"<Name />"+
					"</Party>"+
				"</Parties>"+
				"<Hearings>"+
					"<Hearing>"+
						"<HearingID />"+
						"<SurrogateId />"+
						"<CreatedBy />"+
						"<VenueCode />"+
						"<VenueName />"+
						"<TypeOfHearingCode />"+
						"<TypeOfHearing />"+
						"<Date />"+
						"<Day />"+
						"<Time />"+
						"<Address>"+
							"<AddressId />"+
							"<Line />"+
							"<Line />"+
							"<Line />"+
							"<Line />"+
							"<Line />"+
							"<PostCode />"+
						"</Address>"+
						"<DXNumber />"+
						"<TelephoneNumber />"+
						"<FaxNumber />"+
						"<HoursAllowed />"+
						"<MinsAllowed />"+
						"<DateOfRequestToList />"+
						"<HearingOutcomeCode />"+
						"<HearingOutcome />"+
						"<ListingType />"+
					"</Hearing>"+
				"</Hearings>"+
				"<OwningCourtAddressDetail>"+
					"<Address>"+
						"<AddressId />"+
						"<Line />"+
						"<Line />"+
						"<Line />"+
						"<Line />"+
						"<Line />"+
						"<PostCode />"+
					"</Address>"+
					"<DXNumber />"+
					"<TelephoneNumber />"+
					"<FaxNumber />"+
				"</OwningCourtAddressDetail>"+
			"</MaintainHearing>"+
		"</ds>");
		
		return dom;
}

WPU.getCODebtListXML = function()
{
	var dom = XML.createDOM(null, null, null);
	dom.loadXML("<ds>"+
				"<MaintainCO>"+
					"<CONumber></CONumber>"+
					"<Debts>"+
					"</Debts>"+
				"</MaintainCO>"+
			"</ds>");
			
			return dom;
}


WPU.getWarrentReturnXML = function()
{
	var dom = XML.createDOM(null, null, null);
	dom.loadXML("<ds>"+
					"<WarrantReturns>"+
						"<WarrantEvents>"+
							"<WarrantEvent>"+
								"<Code></Code>"+
								"<CaseNumber></CaseNumber>"+
								"<CaseEventSeq></CaseEventSeq>"+
							"</WarrantEvent>"+
						"</WarrantEvents>"+
					"</WarrantReturns>"+
				 "</ds>");
								
			return dom;

}

WPU.getCOCasemapXML = function()
{
	var dom = XML.createDOM(null,null,null);
	
	dom.loadXML("<ds>"+
				"<MaintainHearing>"+
					"<COType></COType>"+
					"<CONumber></CONumber>"+
					"<Defendant></Defendant>"+
					"<OwningCourtCode></OwningCourtCode>"+
					"<OwningCourt></OwningCourt>"+
					"<OwningCourtAddressDetail>"+
					"<Address>"+
						"<AddressId></AddressId>"+
						"<Line></Line>"+
						"<Line></Line>"+
						"<Line></Line>"+
						"<Line></Line>"+
						"<Line></Line>"+
						"<PostCode></PostCode>"+
					"</Address>"+
					"<DXNumber></DXNumber>"+
					"<TelephoneNumber></TelephoneNumber>"+
					"<FaxNumber></FaxNumber>"+
				"</OwningCourtAddressDetail>"+
				"<Hearings>"+
					"<Hearing>"+
						"<HearingID></HearingID>"+
						"<SurrogateId></SurrogateId>"+
						"<VenueCode></VenueCode>"+
						"<VenueName></VenueName>"+
						"<TypeOfHearingCode></TypeOfHearingCode>"+
						"<TypeOfHearing></TypeOfHearing>"+
						"<Date></Date>"+
						"<Day></Day>"+
						"<Time></Time>"+
						"<Address>"+
							"<AddressId></AddressId>"+
							"<Line></Line>"+
							"<Line></Line>"+
							"<Line></Line>"+
							"<Line></Line>"+
							"<Line></Line>"+
							"<PostCode></PostCode>"+
						"</Address>"+
						"<DXNumber></DXNumber>"+
						"<TelephoneNumber></TelephoneNumber>"+
						"<FaxNumber></FaxNumber>"+
						"<HoursAllowed></HoursAllowed>"+
						"<MinsAllowed></MinsAllowed>"+
						"<DateOfRequestToList></DateOfRequestToList>"+
						"<CreatedBy></CreatedBy>"+
					"</Hearing>"+
				"</Hearings>"+
			"</MaintainHearing>"+
			"</ds>");
		
		return dom;
}
	
/*WPU.getUpdateCOEventXML = function() {
	var dom = XML.createDOM();
	dom.loadXML("<COEvent><CONumber/><StandardEventId/><StandardEventDescription/><EventDetails/><EventDate/><UserName/><ReceiptDate/><IssueStage/><Service/><BailiffId/><ServiceDate/><ErrorInd/>"+
	"<OwningCourtCode/><DebtSeqNumber/><COEventSeq/><BMSTask/><StatsModule/><AgeCategory/><WarrantId/><ProcessDate/></COEvent>");
	return dom;
}*/

WPU.getUpdateCOEventXML = function() 
{
	var dom = XML.createDOM();
	dom.loadXML("<ManageCOEvents>"+
	  				"<CONumber></CONumber>"+
					"<COEvents>"+
						"<COEvent>"+
							"<COEventSeq />"+
							"<StandardEventId />"+
							"<StandardEventDescription />"+
							"<EventDetails />"+
							"<EventDate />"+
							"<UserName />"+
							"<ReceiptDate />"+
							"<IssueStage />"+
							"<Service />"+
							"<BailiffId />"+
							"<ServiceDate />"+
							"<DebtSeqNumber />"+
							"<ErrorInd />"+
							"<OwningCourtCode />"+
							"<Status />"+
							"<BMSTask />"+
							"<StatsModule />"+
							"<AgeCategory />"+
							"<WarrantId />"+
							"<ProcessDate />"+
						"</COEvent>"+
					"</COEvents>"+
	  			"</ManageCOEvents>");
	  		
	  return dom;

}

WPU.getHearingCOXML = function()
{
	var dom = XML.createDOM(null,null,null);
	
	dom.loadXML("<ds>"+
				"<MaintainHearing>"+
					"<CaseNumber></CaseNumber>"+
					"<OwningCourtCode></OwningCourtCode>"+
					"<OwningCourt></OwningCourt>"+
					"<Parties>"+
						"<Party>"+
							"<PartyType></PartyType>"+
							"<Number></Number>"+
							"<Name></Name>"+
						"</Party>"+
					"</Parties>"+
					"<Hearings>"+
						"<Hearing>"+
							"<HearingID></HearingID>"+
							"<SurrogateId></SurrogateId>"+
							"<VenueCode></VenueCode>"+
							"<VenueName></VenueName>"+
							"<TypeOfHearingCode></TypeOfHearingCode>"+
							"<TypeOfHearing></TypeOfHearing>"+
							"<Date></Date>"+
							"<Day></Day>"+
							"<Time></Time>"+
							"<Address>"+
								"<AddressId></AddressId>"+
								"<Line></Line>"+
								"<Line></Line>"+
								"<Line></Line>"+
								"<Line></Line>"+
								"<Line></Line>"+
								"<PostCode></PostCode>"+
							"</Address>"+
							"<DXNumber></DXNumber>"+
							"<TelephoneNumber></TelephoneNumber>"+
							"<FaxNumber></FaxNumber>"+
							"<HoursAllowed></HoursAllowed>"+
							"<MinsAllowed></MinsAllowed>"+
							"<DateOfRequestToList></DateOfRequestToList>"+
							"<HearingOutcomeCode></HearingOutcomeCode>"+
							"<HearingOutcome></HearingOutcome>"+
						"</Hearing>"+
					"</Hearings>"+
					"<OwningCourtAddressDetail>"+
						"<Address>"+
							"<AddressId></AddressId>"+
							"<Line></Line>"+
							"<Line></Line>"+
							"<Line></Line>"+
							"<Line></Line>"+
							"<Line></Line>"+
							"<PostCode></PostCode>"+
						"</Address>"+
						"<DXNumber></DXNumber>"+
						"<TelephoneNumber></TelephoneNumber>"+
						"<FaxNumber></FaxNumber>"+
					"</OwningCourtAddressDetail>"+
					"<COType></COType>"+
					"<CONumber></CONumber>"+
					"<Defendant></Defendant>"+
				"</MaintainHearing>"+
			"</ds>");

        return dom;
}

	
WPU.getSolicitorXML = function()
{
	var dom = XML.createDOM(null,null,null);
	
	dom.loadXML("<Solicitor>"+
				  	"<Status/>"+
				  	"<SurrogateId/>"+
				  	"<PartyId/>"+
				  	"<Number/>"+
				  	"<Code/>"+
					"<ContactDetails>"+
						"<Address>"+  
						  	"<AddressId/>"+
						  	"<Line/>"+
						  	"<Line/>"+
						  	"<Line/>"+ 
						  	"<Line/>"+ 
						  	"<Line/>"+ 
						  	"<PostCode/>"+
						  	"<PartyId/>"+ 
					  	"</Address>"+
					  	"<DX/>"+ 
					  	"<TelephoneNumber/>"+ 
					  	"<FaxNumber/>"+ 
					  	"<EmailAddress/>"+ 
					  	"<PreferredCommunicationMethod/>"+	
				  	"</ContactDetails>"+
				  	"<Type>Solicitor</Type>"+ 
	  				"<TypeCode>SOLICITOR</TypeCode>"+ 
	  				"<Name/>"+
	 		 	"</Solicitor>");
	 return dom;			  		
}
	
	
WPU.getupdateCaseEventXML = function( eventSeqNo, bmsTaskNo )
{	
	var dom = XML.createDOM(null,null,null);
	
	dom.loadXML("<CaseEvents><CaseEvent>"+
					"<Status>DETAILS_CHANGED</Status>"+
					"<CaseEventSeq>"+eventSeqNo+"</CaseEventSeq>"+
					"<BMSTask>"+bmsTaskNo+"</BMSTask>"+
				"</CaseEvent></CaseEvents>");
				
				
	return dom;	
}


WPU.getaddCaseEventXML = function(eventId, eventDate, caseNumber, createdBy)
{
	var dom = XML.createDOM(null,null,null);
	
	dom.loadXML(
				 	"<CaseEvent>"+
					  "<CaseEventSeq></CaseEventSeq>"+
					  "<CaseNumber>"+caseNumber+"</CaseNumber>"+
					  "<StandardEventId>"+eventId+"</StandardEventId>"+
					  "<SubjectPartyKey></SubjectPartyKey>"+ 
					  "<SubjectPartyRoleCode></SubjectPartyRoleCode>"+ 
					  "<SubjectCasePartyNumber></SubjectCasePartyNumber>"+ 
					  "<EventDetails></EventDetails>"+ 
					  "<EventDate>"+eventDate+"</EventDate>"+
					  "<UserName>"+createdBy+"</UserName>"+ 
					  "<ReceiptDate>"+eventDate+"</ReceiptDate>"+ 
					  "<InstigatorList></InstigatorList>"+ 
					  "<BMSTaskDescription></BMSTaskDescription>"+ 
					  "<StatsModDescription></StatsModDescription>"+ 
					  "<CaseFlag></CaseFlag>"+ 
					  "<CourtCode></CourtCode>"+	
   				      "<CreatedBy>"+createdBy+"</CreatedBy>"+ 				  
					"</CaseEvent>"
				);
	return dom;					
}

/**
 * Load required warrant data to EnterVariableData for access by templates ----------- BULLLL - DO NOT COPY DATA FOR THIS REASON!!!!
 * @param nodesList - array of node names to select and add under EnterVariableData
 */
WPU.loadWarrantData = function( nodesList, loadtoxpath )
{
//Rewrite to use with FinalReturnCodes if requried	
	
	var dsWarXPath =  WPU.NODE_XPATHS['Warrant'];
	for( var i = 0; i < nodesList.length; i++)
	{	var nodeName = nodesList[i];
		var selectNode = WPU.getSingleNode(dsWarXPath+"/"+nodeName);
		if (null!= selectNode) selectNode = selectNode.cloneNode(true);
		Services.addNode(selectNode, loadtoxpath );			
	}
	
}

WPU.loadBailiffRefData = function(xpath)
{	    
	var defaultXpath = "/ds/CaseEvent/CourtCode";
	var xpathToUse = null;
	// If this method is not called with an xpath parameter then use the default xpath
	if (arguments.length == 0) 
	{
		xpathToUse = defaultXpath;
	}
	// Otherwise use the given xpath parameter
	else
	{
		xpathToUse = xpath;	
	}
	var courtcode = Services.getValue(xpathToUse);		
	var params = new ServiceParams();
	params.addSimpleParameter( "courtCode", courtcode );
	Services.callService("getCourtMaintain", params, CourtMaintainHandler, true );
}

/** start generic handler object **/
/**
 * SUPS CaseMan Word Processing Handler object
 * @constructor
 */
function CaseManWPHandler() { }
/**
 * SUPS CaseMan Word Processing Handler object - prototype
 */
CaseManWPHandler.prototype = new Object();

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
CaseManWPHandler.prototype.constructor = CaseManWPHandler;

/**
 * SUPS CaseMan Word Processing Handler object
 * @type String
 * @returns string representation of this WP Handler
 */
CaseManWPHandler.prototype.toString = function() {
	return "CaseManWPHandler"; }

/**
 * CaseManWPHandler web service business expcetion handler
 */
CaseManWPHandler.prototype.onBusinessException = function(exception) {
	WPError.ReportStepServiceError(this, exception); }

/**
 * CaseManWPHandler web service system expcetion handler
 */
CaseManWPHandler.prototype.onSystemException = function(exception)  {
	WPError.ReportStepServiceError(this, exception); }





//--------------------------------- CourtMaintainHandler -----------------------------------------------------------------

function CourtMaintainHandler() {
  CaseManWPHandler.apply(this, []); 
};

/**
 * SUPS CaseMan Word Processing Handler object - prototype
 */
CourtMaintainHandler.prototype = new Object();

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
CourtMaintainHandler.constructor = CourtMaintainHandler;

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
CourtMaintainHandler.onSuccess = function( dom )
{	
	var telno =  XML.getNodeTextContent( dom.selectSingleNode("//BailiffTelephoneNumber"));
	if(telno == null)
	{
		telno = "  ";
	}
	var openFrom = XML.getNodeTextContent( dom.selectSingleNode("//BailiffOpenFrom"));
	if(openFrom == null)
	{
		openFrom = "  ";
	}	
	var opento = XML.getNodeTextContent( dom.selectSingleNode("//BailiffOpenTo"));
	if(opento == null)
	{
		opento = "  ";
	}		
	var midday = 43250;
	var fromStrg = "am";
	var toStrg = "am";
	if( openFrom >= midday){ fromStrg = "pm"; }
	if( opento >= midday){ toStrg = "pm"; }
	var ofTime = WPU.convertSecondsToTime(openFrom);
	var otTime = WPU.convertSecondsToTime(opento);
	
	var dom = XML.createDOM();
		dom.loadXML("<bailiff><telephone>"+telno+"</telephone><availability>"+ofTime+fromStrg+" - "+otTime+toStrg+"</availability></bailiff>");
		Services.addNode(dom, "/ds/EnterVariableData" );		
}



WPU.loadTransferCaseData = function( nodeArr, loadtoxpath )
{   
	var dsTranPath = WPU.NODE_XPATHS['TransferCase'];
	for( var i = 0; i < nodeArr.length; i++)
	{	var nodeName = nodeArr[i];
		var selectNode = WPU.getSingleNode(dsTranPath+"/"+nodeName);
		Services.addNode(selectNode, loadtoxpath );		
		
		if( nodeName == "PreviousCourtCode")
		{	
			var courtid = WPU.getValue( dsTranPath+"/"+nodeName );
			WPU.loadTranferedFromCourtData( courtid );
		}	
	}
}

WPU.loadTranferedFromCourtData = function( courtId )
{  
	var params = new ServiceParams();
	params.addSimpleParameter( "qcourtid", courtId );
	Services.callService("getCourt", params, TransferCaseCourtHandler, true );
}

WPU.loadIssueingCourt = function( courtId )
{	
	if( true != Services.exists(WPU.WP_REF_NODE + "/Courts/Court[./Code='"+courtId+"']"))
	{		var params = new ServiceParams();
			params.addSimpleParameter( "qcourtid", courtId );
			Services.callService("getCourt", params, IssueingCourtHandler, true );
	}	
}

WPU.loadCourt = function()
{	
	if ( CourtHandler.loaded == false )
	{
		var params = new ServiceParams();
		Services.callService("getCourts", params, CourtHandler, true );
		CourtHandler.loaded = true;
	}
}

WPU.loadCourtShort = function()
{	
	if ( CourtHandler.loaded == false )
	{
		var params = new ServiceParams();
		Services.callService("getCourtsShort", params, CourtHandler, true );
		CourtHandler.loaded = true;
	}
}

WPU.getHumanRightsActUpdateXML = function() {
	var dom = XML.createDOM(null,null,null);
	dom.loadXML("<ds>"+
			"<HumanRightsAct>"+
			  "<Cases>"+
					"<Case>"+
	        			"<CaseNumber></CaseNumber>"+
	        			"<EventDate></EventDate>"+
	        			"<ApplicationJudge></ApplicationJudge>"+
	        			"<UserID></UserID>"+
	        			"<ApplicationDate></ApplicationDate>"+
	        			"<Outcome></Outcome>"+
	        			"<DeletedFlag></DeletedFlag>"+
	        			"<PartyType></PartyType>"+
	        			"<PartyName></PartyName>"+
	        			"<EventSequence></EventSequence>"+
	        			"<Details></Details>"+
	        			"<Protocols>"+
	          				"<Protocol>"+
	            				"<Number></Number>"+
	            				"<Description></Description>"+
	          				"</Protocol>"+ 
	          			"</Protocols>"+
	          			"<Articles>"+
	          				"<Article>"+
            					"<Number></Number>"+
            					"<Description></Description>"+
	          				"</Article>"+
	        			"</Articles>"+
	      			"</Case>"+
      			"</Cases>"+    	
    		"</HumanRightsAct>"+
		"</ds>");	
		
		return dom;
}
	
WPU.getJudgmentUpdateXML = function() {
	var dom = XML.createDOM(null,null,null);
	dom.loadXML("<ds>"+
		"<MaintainJudgment>"+
			"<CaseNumber/>"+
			"<OwningCourtCode/>"+
			"<Judgments>"+
				"<Judgment>"+
					"<PartyRoleCode/>"+
					"<PartyAgainstName/>"+
					"<CasePartyNumber/>"+
					"<PartyKey/>"+
					"<JudgmentId/>"+
					"<WarrantId/>"+
					"<WarrantParty/>"+
					"<SurrogateId/>"+
					"<InFavourParties/>"+
					"<JudgmentEvents/>"+
					"<LiveAE/>"+
					"<VenueCode/>"+
					"<VenueName/>"+
					"<Type/>"+
					"<Date/>"+
					"<DateRTL/>"+
					"<JointJudgment/>"+
					"<Amount/>"+
					"<AmountCurrency/>"+
					"<TotalCosts/>"+
					"<TotalCostsCurrency/>"+
					"<SubTotal/>"+
					"<SubTotalCurrency/>"+
					"<PaidBefore/>"+
					"<PaidBeforeCurrency/>"+
					"<Total/>"+
					"<TotalCurrency/>"+
					"<InstallAmount/>"+
					"<InstallAmountCurrency/>"+
					"<PeriodCode/>"+
					"<PeriodDesc/>"+
					"<FirstPayDate/>"+
					"<PaidInFullDate/>"+
					"<NotificationDate/>"+
					"<Status/>"+
					"<Payee>" +
						"<Name/>" +	
						"<Reference/>" +	
						"<ContactDetails>" +	
							"<Address>" +	
								"<Line/>" +	
								"<Line/>" +	
								"<Line/>" +	
								"<Line/>" +	
								"<Line/>" +	
								"<PostCode/>" +	
							"</Address>" +										
							"<DX/>" +	
							"<TelephoneNumber/>" +	
							"<FaxNumber/>" +
							"<EmailAddress/>" +	
						"</ContactDetails>" +							
						"<BankDetails>" +	
							"<BankName/>" +	
							"<AccountNumber/>" +	
							"<SortCode/>" +	
							"<AccountHolder/>" +	
							"<SlipCode>" +	
								"<Line/>" +
							"</SlipCode>" +	
							"<BankInformation>" +	
								"<Line/>" +
							"</BankInformation>" +	
							"<GiroAccountNumber/>" +
							"<GiroTransaction>" +
								"<Code/>" +
							"</GiroTransaction>" +
							"<APACSTransactionCode/>" +
						"</BankDetails>" +	
					"</Payee>" +					
				"</Judgment>"+
			"</Judgments>"+
		"</MaintainJudgment>"+
			"</ds>");
		return dom; }
		
		
WPU.getWarrentUpdateXML = function()
{
	var dom = XML.createDOM(null,null,null);
	dom.loadXML("<ds>"+
					"<Warrant>"+
						"<WarrantID/>"+
						"<CaseEventSeq/>"+
						"<WarrantNumber/>"+
						"<LocalNumber/>"+
						"<OriginalWarrantNumber/>"+
						"<WarrantType/>"+
						"<CaseNumber/>"+
						"<CONumber/>"+
						"<DateRequestReceived/>"+
						"<IssuedBy/>"+
						"<IssueDate/>"+
						"<OwnedBy/>"+
						"<HomeCourtIssueDate/>"+
						"<ExecutingCourtCode/>"+
						"<BailiffAreaNo/>"+
						"<AdditionalNotes/>"+
						"<BalanceOfDebt/>"+
						"<BalanceOfDebtCurrency/>"+
						"<AmountOfWarrant/>"+
						"<AmountOfWarrantCurrency/>"+
						"<Fee/>"+
						"<FeeCurrency/>"+
						"<SolicitorsCosts/>"+
						"<SolicitorsCostsCurrency/>"+
						"<LandRegistryFee/>"+
						"<LandRegistryFeeCurrency/>"+
						"<BalanceAfterPaid/>"+
						"<BalanceAfterPaidCurrency/>"+
						"<CCBCWarrant/>"+
						"<Claimant>"+
							"<Name/>"+
							"<Code/>"+
							"<Representative>"+
								"<Number/>"+
								"<PartyType/>"+
								"<Name/>"+
								"<Code/>"+
								"<ContactDetails>"+
									"<Address>"+
										"<Line/>"+
										"<Line/>"+
										"<Line/>"+
										"<Line/>"+
										"<Line/>"+
										"<PostCode/>"+
									"</Address>"+
									"<DX/>"+
									"<TelephoneNumber/>"+
									"<FaxNumber/>"+
									"<EmailAddress/>"+
								"</ContactDetails>"+
								"<Reference/>"+
							"</Representative>"+
						"</Claimant>"+
						"<Defendant1>"+
							"<Name/>"+
							"<Number/>"+
							"<PartyType/>"+
							"<Address>"+
								"<Line/>"+
								"<Line/>"+
								"<Line/>"+
								"<Line/>"+
								"<Line/>"+
								"<PostCode/>"+
							"</Address>"+
							"<JudgmentID/>"+
						"</Defendant1>"+
						"<Defendant2>"+
							"<Name/>"+
							"<Number/>"+
							"<PartyType/>"+
							"<Address>"+
								"<Line/>"+
								"<Line/>"+
								"<Line/>"+
								"<Line/>"+
								"<Line/>"+
								"<PostCode/>"+
							"</Address>"+
							"<JudgmentID/>"+
						"</Defendant2>"+
						"<CreatedBy/>"+
						"<ToTransfer>0</ToTransfer>"+
						"<TransferDate/>"+
					"</Warrant>"+
				"</ds>");
				return dom;

}
	
	
WPU.validateEmailAddress = function(email)
{  
	return CaseManValidationHelper.validatePattern(email, 
												CaseManValidationHelper.EMAIL_PATTERN, 
												"CaseMan_invalidEmailAddress_Msg");
}

WPU.validateCurrency = function(value)
{  
	if ("-" == CaseManUtils.stripSpaces(value)) 
	{
		err = ErrorCode.getErrorCode("CaseMan_invalidAmountFormat_Msg");;
	}
	else
	{
		err = CaseManValidationHelper.validatePattern(value, 
												CaseManValidationHelper.CURRENCY_PATTERN, 
												"CaseMan_invalidAmountFormat_Msg");
	}
	return err;
}

WPU.validateInteger = function(value)
{   
    var err = null;
    
	if( !CaseManValidationHelper.validateNumber(value) )
	{	err = ErrorCode.getErrorCode("CaseMan_invalid_integer_format");
	}
	
	return err;
}

WPU.validatePostcode = function(value)
{  
	var isValid = CaseManValidationHelper.validatePostCode(value);
	var err = null;
	if(!isValid)
	{	err = ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
	return err;
}

WPU.sortGridDatesDsc = function(a,b)
{	CaseManUtils.sortGridDatesDsc(a,b);
}

WPU.convertSecondsToTime = function(pSeconds) 
{	return CaseManUtils.convertSecondsToTime(pSeconds);
}

WPU.formatGridDate = function(value)
{	CaseManUtils.formatGridDate(value);
}

/**********************************************************************************/

// This method ensures a time is transformed so that it can be validated correctly.
// If the pTime param is not a valid time then the method stores teh incorrect value to tyeh DOM
// A CONSTANT is placed at the end of a value as a quick fix re validating wether the user has entered
// an invlid time in number format e.g. 66, 456, 45678.  This means that the incorrect value will 
// not get transformed into a display time when transforming from seconds after midnight to hh:mm
WPU.transformTimeToModel = function(pTime)
{
	var convertedTime = null;
	if(pTime != null){
		pTime = CaseManUtils.stripSpaces(pTime);
		if(CaseManUtils.isBlank(pTime))
		{
			return null;
		}
		if(CaseManValidationHelper.validateTime(pTime))
		{
			convertedTime = CaseManUtils.convertTimeToSeconds(pTime);
		}
		if(convertedTime == null){
			// if the validate method fails nothing is writen to the DOM and 
			// therefore validate does not work. So need to write value to DOM.
			// Only need to ensure correct only when press the save button. So can 
			// write an invalid time here. 
			convertedTime = pTime + INVALIDTIME;	
		}
	}
	return convertedTime;	
}

/**********************************************************************************/
	
// This method ensures a time is transformed from the DOM to display correctly.
// Even if invalid must be displayed as the user entered.
WPU.transformTimeToDisplay = function(pTime) 
{	
	var convertedTime = null;
	if(pTime != null){
		// remove the invalid time string - if there is one
		var posOfInvalidString = pTime.indexOf(INVALIDTIME);
		if(posOfInvalidString > -1)
		{
			pTime = pTime.slice(0, posOfInvalidString);
			convertedTime = pTime;
		}
		else{
			var convertedTime = CaseManUtils.convertSecondsToTime(pTime);
			if(convertedTime != null)
			{
				if(!CaseManValidationHelper.validateTime(convertedTime))
				{			
					// need to return something so the user can see that they have 
					// entered invalid value.
					convertedTime = pTime;
				} // end if(errCode == null ){	
			}// end if(convertedTime == null)
			else
			{
				convertedTime = pTime;
			}
		}
	}// end of if(pTime != null){
	return convertedTime;
}// end of transformToDisplayTime(pTime)

WPU.addOtherLitigiousParty = function(type, name)
{			
			var dom = XML.createDOM();
			dom.loadXML("<LitigiousParty><PartyId>APP</PartyId><Number>0</Number><Type>"+
			type+"</Type><TypeCode>CLAIMANT</TypeCode><Name>"+
			name+"</Name></LitigiousParty>");
			Services.addNode(dom, DATA_XPATH + "/Parties" );	
			
}


WPU.loadProtocolAndArticles = function()
{
	var pageData = "/ds/var/app/wp";
	
	var articlesDom = XML.createDOM(null,null,null);
	var protocolsDom = XML.createDOM(null,null,null);
	var exists = Services.exists("/ds/var/app/wp/Articles");
	
	if( true != exists )
	{	articlesDom.loadXML 
						("<Articles>"+
							"<Article><id>1</id><label>2 Right to Life</label></Article>"+
							"<Article><id>2</id><label>3 Prohibition of Torture</label></Article>"+
							"<Article><id>3</id><label>4 Prohibition of Slavery and Forced Labour</label></Article>"+
							"<Article><id>4</id><label>5 Right to Liberty and Security</label></Article>"+
							"<Article><id>5</id><label>6 Right to a Fair Trial</label></Article>"+
							"<Article><id>6</id><label>7 No Punishment without Law</label></Article>"+
							"<Article><id>7</id><label>8 Right to Respect for Private and Family Life</label></Article>"+
							"<Article><id>8</id><label>9 Freedom of Thought, Conscience and Religion</label></Article>"+
							"<Article><id>9</id><label>10 Freedom of Expression</label></Article>"+
							"<Article><id>10</id><label>11 Freedom of Assembly and Association</label></Article>"+
							"<Article><id>11</id><label>12 Right to Marry</label></Article>"+
							"<Article><id>12</id><label>14 Prohibition of Discrimination</label></Article>"+
							"<Article><id>13</id><label>16 Restrictions on Political Activity of Aliens</label></Article>"+
							"<Article><id>14</id><label>17 Prohibition of Abuse of Rights</label></Article>"+
							"<Article><id>15</id><label>18 Limitation on Use of Restrictions on Rights</label></Article>"+
						"</Articles>");
		protocolsDom.loadXML(
						"<Protocols>"+
							"<Protocol><id>1</id><label>1.1 Protection of Property</label></Protocol>"+
							"<Protocol><id>2</id><label>1.2 Right to Education</label></Protocol>"+
							"<Protocol><id>3</id><label>1.3 Right to Free Election</label></Protocol>"+
							"<Protocol><id>4</id><label>6.1 Abolition of the Death Penalty</label></Protocol>"+
							"<Protocol><id>5</id><label>6.2 Death Penalty in Time of War</label></Protocol>"+
						"</Protocols>");
						
		Services.addNode(articlesDom, pageData );
		Services.addNode(protocolsDom, pageData );
	}
}

WPU.loadRepresentations = function() {

	var repXPath = "/ds/var/app/wp/representations";
	
	var repDom = XML.createDOM(null,null,null);
	
	var xmlstr = "<representations><representation><PartyId></PartyId><Representation></Representation></representation>";

	var nonSolParties = Services.getNodes("/ds/ManageCase/Parties/LitigiousParty");

	var noOfNonSolParties = nonSolParties.length;

	for (var i=0; i < noOfNonSolParties; i++) 
	{
		var nonSolParty = nonSolParties[i];
		
		var surSolIdNode = nonSolParty.selectSingleNode("SolicitorSurrogateId");
		var surSolId = XML.getNodeTextContent(surSolIdNode);
		
		
		if ( null != surSolId && "" != surSolId) 
		{
			var partyTypeNode = nonSolParty.selectSingleNode("Type");
			var partyType = XML.getNodeTextContent(partyTypeNode);
			var partyNumbNode = nonSolParty.selectSingleNode("Number");
			var partyNumb = XML.getNodeTextContent(partyNumbNode);
			var partyNameNode = nonSolParty.selectSingleNode("Name");
			var partyName = XML.getNodeTextContent(partyNameNode);
			var partyIdNode = nonSolParty.selectSingleNode("PartyId");
			var partyId = XML.getNodeTextContent(partyIdNode);
		
			var solNode = Services.getNode("/ds/ManageCase/Parties/Solicitor[SurrogateId = '"+surSolId+"']");
			var solNumbNode = solNode.selectSingleNode("Number");
			var solNumb = XML.getNodeTextContent(solNumbNode);
			var solNameNode = solNode.selectSingleNode("Name");
			var solName = XML.getNodeTextContent(solNameNode);
		 
		    // Trac 3432 - Added lines to filter out ampersands in Names
		    partyName = partyName.replace("&","&amp;");
		    solName = solName.replace("&","&amp;");
			
			xmlstr += "<representation><PartyId>"+partyId+"</PartyId><Representation>Solicitor "+solNumb+" ("+solName+") for "+partyType+" "+partyNumb+" ("+partyName+")</Representation></representation>";
		}	
			
	}
	xmlstr += "</representations>";
	repDom.loadXML(xmlstr);
	Services.replaceNode(repXPath, repDom);
}
	
WPU.getFeeForCode = function( notesString )
{	
 	if( null != notesString)
 	{	notesString = notesString.toUpperCase();
 	    if( 0 == notesString.indexOf('ALLOCATION')) return "A";
	 	if( 0 == notesString.indexOf('FILING')) return "F";
	 	if( 0 == notesString.indexOf('LISTING')) return "L";
	 }
	return null;
}

WPU.getBMSTask  = function()
{
	var output = WP.GetScreenProcess().getOutput().getCJRReference();
	var bmsTaskNo = null;
	var hearingType;
	var listing = Services.getValue("/ds/EnterVariableData/TrialNotice/listing");
			
	if( "CJR024" == output)
	{	
         hearingType = Services.getValue("/ds/EnterVariableData/ConfNotice/hearingType2");		 		 
		 
		 if("FAST TRACK" ==  hearingType || "MULTI TRACK" == hearingType)
		 {  //LST Then BMS TASK= LS1
		 	if( "LST"  == listing)
		 	{	bmsTaskNo = "LS1";
		 	}
		 	else if( "RELST" == listing)
		 	{	bmsTaskNo = "LS4";
		 	}
		 }
		 else if("DISPOSAL/ASSESSMENT" == hearingType)
		 {		if( "LST"  == listing)
		 	{	bmsTaskNo = "LS10";
		 	}
		 	else if( "RELST" == listing)
		 	{	bmsTaskNo = "LS11";
		 	}
		 }	 	 
	}
	else if("CJR028" == output)
	{	
		hearingType = Services.getValue("/ds/EnterVariableData/TrialNotice/hearingType");		
		
		if( "FTH" == hearingType || "MTH"  == hearingType)
		{	if( "LST"  == listing)
		 	{	bmsTaskNo = "LS1";
		 	}
		 	else if( "RELST" == listing)
		 	{	bmsTaskNo = "LS4";
		 	}
		}
		else if( "SCH"  == hearingType)
		{	if( "LST"  == listing)
		 	{	bmsTaskNo = "LS2";
		 	}
		 	else if( "RELST" == listing)
		 	{	bmsTaskNo = "LS5";
		 	}
		}
	    else if( "DAH"  == hearingType)
	    {	if( "LST"  == listing)
		 	{	bmsTaskNo = "LS10";
		 	}
		 	else if( "RELST" == listing)
		 	{	bmsTaskNo = "LS11";
		 	}
	    }				
	}
	else if("CJR020" == output) { 
		bmsTaskNo = "LS1"; }		
	return bmsTaskNo; }

/**
 *Identifies line breaks and returns a string in which each line is wraped in a <line></line> tag
 */
WPU.encodeLineBreaks = function(adaptor, stringVal) {	
	var updateXMLVersion = false;
	var dom = Services.getNode(adaptor.dataBinding+ "/xmlversion");
	if (null != dom) {
		XML.removeChildNodes(dom);
		updateXMLVersion = true; }	
	var pathname = "";
	var nodename = adaptor.dataBinding + "/xmlversion";
	if (-1 != nodename.indexOf("/")) {
		pathname = nodename.substring(0, nodename.lastIndexOf("/"));
		nodename = nodename.substring(nodename.lastIndexOf("/")+1, nodename.length); }	
	dom = XML.createElement(Services.getNode('/'), nodename);	
	if( null != stringVal ) {					
		var lineArr = stringVal.split('\r');	
		var domdoc = dom.ownerDocument;				
		for( var i = 0; i < lineArr.length; i++ ) {	
			filteredString = WPU.removeWhiteSpace(lineArr[i]);
			if(filteredString.length > 0){
				var lineNode = domdoc.createElement("line");
				lineNode.appendChild(domdoc.createTextNode(filteredString));	
				dom.appendChild(lineNode); } }
		if (true == updateXMLVersion) {
 			Services.replaceNode(pathname + "/" + nodename, dom); } 
		else {			
			Services.addNode(dom, pathname); } }			
	return stringVal; }

/**
 * Removes whitespace from the edges (begining and end) of a sentence.performs the equivalent of 
 * of the trim function found in other languages.
 */
WPU.removeWhiteSpace = function(unfilteredString){
	filteredString = "";
	stringArray = unfilteredString.split(/\s/g);
    for(k=0; k<stringArray.length; k++){
    	if((stringArray.length-1) != k){
        	filteredString += stringArray[k]+" "; }
        else{
        	filteredString += stringArray[k]; } }
	return filteredString; }

/**
 * Removes data from TextAreas just before the form is submitted. This data is regarded as noise
 * as each line in the text area has been written to a new tag known as line. This format is part of the  
 * output of encodeLinebreaks
 */
WPU.filterTextAreaTextNodes = function(domValue) {
	if(domValue != null) {
		/**check if we have XML type nodes **/
		var troublesomeNodes = domValue.selectNodes("//*[count(child::text()) > 0 and count(child::text()) != count(child::node())]");
		var nodLen = troublesomeNodes.length;
		for (var i = 0; i<nodLen; i++) {
			var node = troublesomeNodes[i];
			var xmlversion = node.selectSingleNode(WPU.filterTextArea__SELECTXMLVERSION);
			if (null != xmlversion) {
				var clonedXMLVersion = xmlversion.cloneNode(true);
				var child = node.firstChild;
				while (null != child) {
					node.removeChild(child);
					child = node.firstChild; }
				node.appendChild(clonedXMLVersion); } } } }

/**
 * Used by textarea questions
 */
WPU.decodeLineBreaks = function( adaptor, domValue ) {  
	var retStrg  = "";	
	if( null != domValue && null != domValue.ownerDocument ) {
		var lines = domValue.selectNodes("//line");
		var lineNo = lines.length;
		for (var i=0; i <lineNo; i++) {
			var line = lines[i];
			retStrg += XML.getNodeTextContent(line) + "\r"; } }
	else {
		retStrg = domValue; }
	return retStrg; } 	
	
/**
 * Tag for an invalid time. Used when store invalid time in DOM.	
 */
var INVALIDTIME = "[]INVALID[]"; 

/**
 * Validation method for datepicker field
 * wraps framework code
 */
function isValidDate( dateString ) {
	var msg = null;
    if( null != dateString ) {	
    	datePatternToUse = CaseManValidationHelper.YYYYMMDD_DATE_PATTERN;
    	if((arguments.length>1)&& (arguments[1] != null)&&(arguments[1] == "true")){
	    	datePatternToUse = CaseManValidationHelper.DDMMMYYYY_DATE_PATTERN; }
    	else if((arguments.length>1)&& (arguments[1] != null)&&(arguments[1] != "true")&&(arguments[1] != "false")){
	    	datePatternToUse = arguments[1]; }    	
	    msg = CaseManValidationHelper.validatePattern(dateString, datePatternToUse, "CaseMan_invalidDateFormat_Msg" ); }
    if((datePatternToUse != CaseManValidationHelper.YYYYMMDD_DATE_PATTERN)&& (msg !=null)) {
    	return msg; }
    else return( null == msg); }

/**
 * Checks whether the supplied date is in the future
 * @param checkDate - the date to check
 * @param dateType - set to true if this date represents a date type of format DD-MMM-YYYY
 * @return true if the date is in the future, null if today, otherwise false
 */
function isFutureDate( checkDate,dateType ) {	
 	if(arguments.length<2) {
 		dateType = "false"; } 	
    var thisDate = getDateObject( checkDate,dateType );
    if( null == thisDate ){ return null; }    
    var checkVal = WPS.__CaseManUtils().compareDates(  new Date(), thisDate );        
    if( -1 == checkVal ) {
    	return false; }
    else if( 0 == checkVal ) { 
    	return null; }
    else {  
    	return true; } }
 
/**
 * Returns a date object for the corresponding string or null if method fails
 * @param stringDate - assumes format yyyy-mm-dd
 * @param dateType This string must be written as true to cause this method to assume the date format dd-mmm-yyyy,it will return null if it fails to create
 *  a date object from the provided string
 */
WPU.getDateObject = function(stringDate, dateType) {    
	if (null != stringDate) {	 
		var dateArr = stringDate.split('-');  	  
 	  	var mnth = null;
		if( (null != dateArr) && (3 == dateArr.length )) {  
			if((arguments.length>1)&& (arguments[1] != null)&&(arguments[1] == "true")) {
				dateArr[1] = getMonthFromAbbrev(dateArr[1]);
                mnth = parseInt(dateArr[1],10);                    
                if(dateArr[1] != -1) {
					return( new Date(dateArr[2], mnth,dateArr[0] )); } }
			else {
				mnth = parseInt(dateArr[1],10) -1;                  
                return (new Date(dateArr[0], mnth, dateArr[2])); } } }
	return null; }

/**
 * Returns a date object for the corresponding string or null if method fails
 * @deprecated - see WPU.getDateObject(...)
 */
function getDateObject( stringDate,dateType ) {    
   return WPU.getDateObject(stringDate,dateType);
   /**alert("deprecated function -- use WPU. equivalent "); **/ }
 
/**
 * Helper function for the getDateObject
 * Converts a month from its 3 length abbreviation to its numeric javascript equivalent
 * returns -1 if the month string abbreviation cannot be parsed
 * @param monthAbbrev, the 3 string representation of the month of the year
 */
function getMonthFromAbbrev(monthAbbrev){
	var numFromMon = -1;
 	monthAbbreviation = new String(monthAbbrev);
 	monthAbbreviation = monthAbbreviation.toUpperCase(); 	
 	if((monthAbbreviation != null)&&(monthAbbreviation!="")&&(monthAbbreviation.length==3)){
 		var monthAbbrevArray = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
 		for(i=0;i<monthAbbrevArray.length;i++){
 			if(monthAbbreviation == monthAbbrevArray[i] ){
 				numFromMon = i;
 				break; } } }
 	return numFromMon; }
  
/**
 * Validate that value is currency and if passed, formats to two dp. 
 * If fails - returns the original value
 */  
WPU.formatToTwoDP = function(value) {
	var anErrorCode = "CaseMan_invalidAmountFormat_Msg";
	var fval = parseFloat(value).toFixed(2);
	if ("NaN" == fval) {
		 errCode = ErrorCode.getErrorCode(anErrorCode);
		 fval = "-"; }
	else {
		var errCode = CaseManValidationHelper.validatePattern(fval, CaseManValidationHelper.CURRENCY_PATTERN, anErrorCode); }
	return fval; }

/**
*	Looks at all parties on the case and filters for part 20 claimaints and their associated solicitors
*/
WPU.selectPart20Claimants = function() {   
	var partiesNode = Services.getNodes("/ds/ManageCase/Parties/LitigiousParty[./TypeCode = 'PT 20 CLMT']");	
	var dom = XML.createDOM(null,null,null);
	dom.loadXML("<Part20Claimants></Part20Claimants>");	
	var solsurid = null;
	var solNode = null;
	for( var i = 0; i < partiesNode.length; i++) {	 
		dom.selectSingleNode("/Part20Claimants").appendChild( partiesNode[i]);
		solsurid = XML.getNodeTextContent( partiesNode[i].selectSingleNode("SolicitorSurrogateId")); 
		solNode = Services.getNode("/ds/ManageCase/Parties/Solicitor[./Status = 'EXISTING' and ./SurrogateId = '"+solsurid+"']");
		if (null != solNode) {				  
			dom.selectSingleNode("/Part20Claimants").appendChild( solNode ); } }
	var xpath = "/ds/var/app/WPData";
	if( false == Services.exists(xpath+"/Part20Claimants")) { 
		Services.addNode(dom, xpath); }
	else {	
		Services.replaceNode(xpath+"/Part20Claimants", dom); } } 

/**
 *
 */
WPU.selectPart20Defendants = function() {	 
	var partiesNode = Services.getNodes("/ds/ManageCase/Parties/LitigiousParty[./TypeCode = 'PT 20 DEF']");
	var dom = XML.createDOM(null,null,null);
	dom.loadXML("<Part20Defendants></Part20Defendants>");	
	var solsurid = null;
	var solNode = null;
	for( var i = 0; i < partiesNode.length; i++) {				
		dom.selectSingleNode("/Part20Defendants").appendChild( partiesNode[i]);
		solsurid = XML.getNodeTextContent( partiesNode[i].selectSingleNode("SolicitorSurrogateId"));
		solNode = Services.getNode("/ds/ManageCase/Parties/Solicitor[./Status = 'EXISTING' and ./SurrogateId = '"+solsurid+"']");				  		
		if (null != solNode) {	
			dom.selectSingleNode("/Part20Defendants").appendChild( solNode ); } }	
	var xpath = "/ds/var/app/WPData";
	if( false == Services.exists(xpath+"/Part20Defendants")) { 
		Services.addNode(dom, xpath); }
	else {	
		Services.replaceNode(xpath+"/Part20Defendants", dom); } }

/**
 *
 */
WPU.getAEAttendees = function (aeEventCase, aeNumber) {	
	loadAEDetails( aeEventCase, AEAttendeesHandler );	
	/**get the specific aeapplication**/
	var aeapp = Services.getNode("/ds/wp/AEApplications/AEApplication[AENumber='"+aeNumber+"']");
	var partyAgainstCode = WPU.getValue( "PartyAgainstPartyRoleCode", aeapp);
	var partyAgainstNumb = WPU.getValue( "PartyAgainstCasePartyNumber", aeapp);
	var partyForRoleCode = WPU.getValue( "PartyForPartyRoleCode", aeapp);
	var partyForNumber = WPU.getValue( "PartyForCasePartyNumber", aeapp);
	var partyIds = new Array();
	partyIds[""+Services.getValue("/ds/ManageCase/Parties/LitigiousParty[SurrogateId='"+
					partyAgainstCode+"_"+partyAgainstNumb+"']/PartyId")+""] = true;
	partyIds[""+Services.getValue("/ds/ManageCase/Parties/LitigiousParty[SurrogateId='"+
					partyForRoleCode+"_"+partyForNumber+"']/PartyId")+""] = true;	
	return partyIds; }

/**
 *
 */
function Float(){}

/**
 *
 */
Float.greaterThan = function(number1, number2) {
	number1 = Math.round(number1*Math.pow(10, 3));
	number2 = Math.round(number2*Math.pow(10, 3));
	return number1 > number2; }

/**
 *
 */
Float.lessThan = function(number1, number2) {
	number1 = Math.round(number1*Math.pow(10, 3));
	number2 = Math.round(number2*Math.pow(10, 3));
	return number1 < number2; }
	
/**
 *
 */
Float.equalTo = function(number1, number2) {
	number1 = Math.round(number1*Math.pow(10, 3));
	number2 = Math.round(number2*Math.pow(10, 3));
	return number1 == number2; }

/**
 *
 *Checks that the paramater 'value' does not exceed the paramater 'max'
 * Returns an error message string if value is greater than max or negative
 *@param: value
 *@param max
 *@return ErrorCode
 */
function validateCurrencyValue( value, max, zeroNotAllowed) { 
	var err = null;
 	var errCode = null;
 	if (!CaseManUtils.isBlank(value)) {
	   errCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");
	    if(null == errCode) {  
	   		var lowerLimitBreached = (true == zeroNotAllowed) ? parseFloat(value) <= 0 : false;
	   		if ("-" == CaseManUtils.stripSpaces(value)) {
	   	  		errCode = ErrorCode.getErrorCode("CaseMan_invalidAmountFormat_Msg"); }
	      	else if(Float.lessThan(parseFloat(value), 0)) {
		  		errCode = ErrorCode.getErrorCode("CaseMan_negativeAmountEntered_Msg"); }
			else if(Float.greaterThan(parseFloat(value), max ) || lowerLimitBreached ) {
				if (max == 5000.00) {
					err = "CaseMan_provisionalCostsAmountExceeded_Msg";
				}
		    	else if (max == 99999.99) { 
			        if (zeroNotAllowed) { err = "CaseMan_amountIncorrectRange7_Msg"; }
		        	else { err = "CaseMan_amountIncorrectRange07_Msg"; } }
		     	else if(max == 999999.99) {	
			     	if (zeroNotAllowed) { err = "CaseMan_amountIncorrectRange8_Msg"; }
					else { err = "CaseMan_amountIncorrectRange08_Msg"; } }
				else if (max == 9999999.99) {	
			    	if (zeroNotAllowed) { err = "CaseMan_amountIncorrectRange9_Msg"; }
					else { err = "CaseMan_amountIncorrectRange09_Msg"; }  }
		     	else if (max == 99999999.99) {	
			    	if (zeroNotAllowed) { err = "CaseMan_amountIncorrectRange10_Msg"; }
					else { err = "CaseMan_amountIncorrectRange010_Msg"; } }
		     	else if (max == 999999999.99) { 	
		        	if (zeroNotAllowed) { err = "CaseMan_amountIncorrectRange11_Msg"; }
					else { err = "CaseMan_amountIncorrectRange011_Msg"; } } 	         
	         	if (err != null) {
	         		errCode = ErrorCode.getErrorCode(err); } } } }
	return errCode; }

/**
 * Compare dates. Date 1 before Date 2 === date 1 < date 2
 * @param dateStg1 - assumes format yyyy-mm-dd
 * @param dateStg2 - assumes format yyyy-mm-dd
 * @return -1 (dateStg1 < dateStg2) 0 (dateStg1 = dateStg2) or 1 (dateStg1 > dateStg2)
 */
function compareDateStrings (dateStg1 ,dateStg2) {
    var dateObj1  = getDateObject(dateStg1);
    var dateObj2  = getDateObject(dateStg2);	
	if( dateObj1 == null || dateObj2 == null ) return null;
	else return	WPS.__CaseManUtils().compareDates( dateObj1 ,dateObj2 ); }

/**
 *
 */
function loadNonWorkingDays() {	
	if ( DateHandler.loaded == false ) {
		var params = new ServiceParams();
		Services.callService("getNonWorkingDays", params, DateHandler, true);
		DateHandler.loaded = true; 
	} }
/**
 *
 */
function loadHearing (caseNumber) { 
	var params = new ServiceParams();
	params.addSimpleParameter("caseNumber", caseNumber);
	Services.callService("getHearing", params, HearingHandler, true);}

/**
 *
 */
function loadN63Hearing (caseNumber) {   
    var params = new ServiceParams();
    params.addSimpleParameter("caseNumber", caseNumber);
    Services.callService("getHearing", params, N63HearingHandler, true); }

/**
 *
 */
function loadCOHearings (coNumber) { 
	var params = new ServiceParams();
	params.addSimpleParameter("coNumber", coNumber);
	Services.callService("getHearingCO", params, HearingHandler, true); }
	
/**
 *
 */
function loadFutureHearing (caseNumber) {   
	var params = new ServiceParams();
	params.addSimpleParameter("caseNumber", caseNumber);
	Services.callService("getHearing", params, FutureHearingHandler, true); }
	
/**
 *
 */
function loadCOFutureHearing (coNumber) {   
	var params = new ServiceParams();
	params.addSimpleParameter("coNumber", coNumber);
	Services.callService("getHearingCO", params, FutureHearingHandler, true); }

/**
 *
 */
function loadPastHearings (caseNumber) {   
	var params = new ServiceParams();
	params.addSimpleParameter("caseNumber", caseNumber);
	Services.callService("getHearing", params, PastHearingHandler, true); }
	
/**
 *
 */
function loadCOPastHearings (coNumber) {   
	var params = new ServiceParams();
	params.addSimpleParameter("coNumber", coNumber);
	Services.callService("getHearingCO", params, PastHearingHandler, true); }

/**
 *
 */
function isNonWorkingDate (checkDate) {   
    if(!DateHandler.loaded) {
    	loadNonWorkingDays(); }	
	return Services.exists(WPU.WP_REF_NODE+"/NonWorkingDays/NonWorkingDay[./Date = '"+checkDate+"']"); }

/**
 *
 */
function loadAEDetails (caseNumber, callbackHandler) {
	var params = new ServiceParams();
	params.addSimpleParameter("caseNumber", caseNumber);
	Services.callService("getCaseAe", params, AEAttendeesHandler, false ); }

/** 
 * AEAttendeesHandler 
 */
function AEAttendeesHandler() {
  CaseManWPHandler.apply(this, []); }

/**
 * SUPS CaseMan Word Processing Handler object - prototype
 */
AEAttendeesHandler.prototype = new Object();

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
AEAttendeesHandler.constructor = AEAttendeesHandler;

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
AEAttendeesHandler.onSuccess = function (dom) {
	Services.addNode(dom.selectSingleNode("/ds/Case/AEApplications"), "/ds/wp"); }

/**
 * IssueingCourtHandler 
 */
function IssueingCourtHandler(){
  CaseManWPHandler.apply(this, []); }

/**
 * SUPS CaseMan Word Processing Handler object - prototype
 */
IssueingCourtHandler.prototype = new Object();

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
IssueingCourtHandler.constructor = IssueingCourtHandler;

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
IssueingCourtHandler.onSuccess = function(dom) {		
	var foreignCourtName = WPU.getValue("/Courts/Court/Name", dom)					
	Services.setValue("/ds/EnterVariableData/Warrant/ForeignCourtName", foreignCourtName); }

/** 
 * TransferCaseCourtHandler 
 */
function TransferCaseCourtHandler(){
  CaseManWPHandler.apply(this, []); }

/**
 * SUPS CaseMan Word Processing Handler object - prototype
 */
TransferCaseCourtHandler.prototype = new Object();

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
TransferCaseCourtHandler.constructor = TransferCaseCourtHandler;

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
TransferCaseCourtHandler.onSuccess = function(dom) {		
	Services.addNode( dom.selectSingleNode("Courts/Court") ,"/ds/EnterVariableData/TransferCase/PreviousCourt"); }

/**
 * CourtHandler 
 */
function CourtHandler(){
  CaseManWPHandler.apply(this, []); }

/**
 * SUPS CaseMan Word Processing Handler object - prototype
 */
CourtHandler.prototype = new Object();

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
CourtHandler.constructor = CourtHandler;
CourtHandler.loaded = false;
/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
CourtHandler.onSuccess = function(dom) {
	var courtsNode = Services.getNode("/ds/var/form/ReferenceData/Courts");
	if (null != courtsNode) {
		Services.removeNode("/ds/var/form/ReferenceData/Courts"); }	
	Services.addNode(dom,"/ds/var/form/ReferenceData");		
	try {	
		if (typeof setOwningCrtDetails != 'undefined') setOwningCrtDetails();	
		if (typeof setCaseOwningCourtDetails != 'undefined')  setCaseOwningCourtDetails();
		/** This handles question 382 specific post data load initialisation **/
		if (typeof JudgmentCourtName != 'undefined' && typeof JudgmentCourtName.courtDataLoadCallBack != 'undefined')  {
			JudgmentCourtName.courtDataLoadCallBack(); }
		/** This handles question 14 specific post data load initialisation **/
		if (typeof VenueName != 'undefined' && typeof VenueName.courtDataLoadCallBack != 'undefined') { VenueName.courtDataLoadCallBack(); } }
	catch(er) {
		alert("There was a problem defaulting question(s) with the owning court details.");		
		if (doLog) do_Log("CourtHandler.onSuccess - There was a problem defaulting question(s) with the owning court details. -" + er.message); } }


/** 
 * DateHandler
 */
function DateHandler(){
  CaseManWPHandler.apply(this, []); }

/**
 * SUPS CaseMan Word Processing Handler object - prototype
 */
DateHandler.prototype = new Object();

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
DateHandler.constructor = DateHandler;

DateHandler.loaded = false;

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
DateHandler.onSuccess = function(dom) {	
	Services.addNode(dom, WPU.WP_REF_NODE);	
	DateHandler.loaded = true; }

/**
 * HearingHandler 
 */
function HearingHandler(){
  CaseManWPHandler.apply(this, []); }

/**
 * SUPS CaseMan Word Processing Handler object - prototype
 */
HearingHandler.prototype = new Object();

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
HearingHandler.constructor = HearingHandler;

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
HearingHandler.onSuccess = function(dom) {  	
	Services.replaceNode("/ds/MaintainHearing", dom.selectSingleNode("/ds/MaintainHearing") ); }

/** 
 * PastHearingHandler 
 */
function PastHearingHandler(){
  CaseManWPHandler.apply(this, []); }

/**
 * SUPS CaseMan Word Processing Handler object - prototype
 */
PastHearingHandler.prototype = new Object();

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
PastHearingHandler.constructor = PastHearingHandler;

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
PastHearingHandler.onSuccess = function(dom) {  	
	var hearAr = dom.selectNodes("/ds/MaintainHearing/Hearings/Hearing");
	var hDate;
	var hid;
	var hear;
	var hearingsNode = dom.selectSingleNode("/ds/MaintainHearing/Hearings");	
	for( var i = 0; i < hearAr.length; i++) {
		hear = hearAr[i];
		hDate = XML.getNodeTextContent( hear.selectSingleNode("./Date"));						
		var isFuture = isFutureDate(hDate);  /**null or true is future(ie ok), false is past **/
		if( isFuture == true ) {	
			hearingsNode.removeChild(hear);	} }
	Services.replaceNode("/ds/MaintainHearing", dom.selectSingleNode("/ds/MaintainHearing") ); }

/**
 * FutureHearingHandler
 */
function FutureHearingHandler(){
  CaseManWPHandler.apply(this, []); }

/**
 * SUPS CaseMan Word Processing Handler object - prototype
 */
FutureHearingHandler.prototype = new Object();

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
FutureHearingHandler.constructor = FutureHearingHandler;

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
FutureHearingHandler.onSuccess = function(dom) {  	
	/**@TODO???? filter out past hearings*/
	var hearAr = dom.selectNodes("/ds/MaintainHearing/Hearings/Hearing");
	var hDate;
	var hid;
	var hear;
	var hearingsNode = dom.selectSingleNode("/ds/MaintainHearing/Hearings");	
	for( var i = 0; i < hearAr.length; i++) {
		hear = hearAr[i];
		hDate = XML.getNodeTextContent( hear.selectSingleNode("./Date"));				
		var isFuture = isFutureDate(hDate);  /**null or true is future(ie ok), false is past**/
		if( false == isFuture) {
			hearingsNode.removeChild(hear);	}  }	
	Services.replaceNode("/ds/MaintainHearing", dom.selectSingleNode("/ds/MaintainHearing") ); }

/**
 * Filter N63 hearings from the node obtained from the dom
 */
function N63HearingHandler() {
  CaseManWPHandler.apply(this, []); }

/**
 * SUPS CaseMan Word Processing Handler object - prototype
 */
N63HearingHandler.prototype = new Object();

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
N63HearingHandler.constructor = N63HearingHandler;

/**
 * SUPS CaseMan Word Processing Handler object - constructor
 */
N63HearingHandler.onSuccess = function(dom) {   
    /**@TODO??: filter out past hearings*/
    var n63hearAr = dom.selectNodes("/ds/MaintainHearing/Hearings/Hearing");
    var n63hear;
    var n63Type;
    var n63hearingsNode = dom.selectSingleNode("/ds/MaintainHearing/Hearings");
    for( var i = 0; i < n63hearAr.length; i++) {
        n63hear = n63hearAr[i];
        n63Type = XML.getNodeTextContent( n63hear.selectSingleNode("./TypeOfHearingCode"));
        if( n63Type != "N63") {
            n63hearingsNode.removeChild(n63hear); } }    
    Services.replaceNode("/ds/MaintainHearing", dom.selectSingleNode("/ds/MaintainHearing") ); }

/*
 * Validate method for time at field
 */ 
function validateTimeAt(pTime) {
	var errCode = null;
	var onTime = CaseManUtils.convertSecondsToTime(pTime);
	if(onTime == null ) {
		errCode = ErrorCode.getErrorCode('CaseMan_invalidTime_Msg'); } 
	else if (!CaseManValidationHelper.validateTime(onTime)) {
		errCode = ErrorCode.getErrorCode('CaseMan_invalidTime_Msg'); }
	return errCode;	}

/**
* Get the obligation expiry date for an existing obligation of a specified type
*@param obligation_type an integer value of an obligation type e.g. type 6
*@return ExpiryDate
*/
function getObligationExpiryDate( obligation_type ) {
    var ot = obligation_type;
    var query = "/ds/wp/MaintainObligations/Obligations/Obligation[ObligationType="+ot+"  and DeleteFlag='N'][1]/ExpiryDate";     
	return Services.getValue(query); }

/**
 *
 */
function isWorkingDayInPast( checkDate ) {
	var isValid = isFutureDate(checkDate);
	var err = null;
	if( true != isValid) {	
		if(isNonWorkingDate( checkDate )) {
			err = ErrorCode.getErrorCode("CaseMan_dateNonWorkingDay_Msg"); } }
	else { 	
		err = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg"); }
	return err; }

/** 
 *
 */
function isWorkingDayInFuture(checkDate) {
	var err = null;				
	if (false != isFutureDate(checkDate)) {	
		if (isNonWorkingDate(checkDate))  {
			err = ErrorCode.getErrorCode("CaseMan_dateNonWorkingDay_Msg"); } }
	else {
		err = ErrorCode.getErrorCode("CaseMan_dateCannotBeInThePast_Msg"); }	
	return err; }

/**
 *
 */
function isInFuture( checkDate ) {
	var err = null;
	var future = isFutureDate(checkDate);
	if (null != future && !future) {
		err = ErrorCode.getErrorCode("CaseMan_dateCannotBeInThePast_Msg"); }
	return err; }

/**
 * checks if this date is in the past
 * @checkDate Usually a String denoting the date to check
 * @param dateType When declared, asserts that this date is of the format DD-MMM-YYYY
 */
function isInPast (checkDate, dateType) {
	var err = null;
 	if(arguments.length<2) {
 		dateType = "false"; }
	var future = isFutureDate(checkDate,dateType);
	if (future) {
		err = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg"); }
	return err; }


