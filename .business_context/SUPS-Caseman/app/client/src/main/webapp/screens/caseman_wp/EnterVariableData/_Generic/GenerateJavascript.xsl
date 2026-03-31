<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2004/07/xpath-functions" xmlns:xdt="http://www.w3.org/2004/07/xpath-datatypes" xmlns:file="java.io.File">
	<xsl:output method="text" indent="no"/>
	<xsl:param name="templateDir"/>
	<xsl:param name="webfileDir"/>
	
	<xsl:template match="Screen">
		<xsl:variable name="thisScreenId">
			<xsl:value-of select="Name"/>
		</xsl:variable>
		<xsl:text>
var CURRENCY_PATTERN 	= /^\-?[0-9]*(\.[0-9]{2})?$/;
var VAR_APP_XPATH		= "/ds/var/app";
var VAR_FORM_XPATH 		= "/ds/var/form";
var VAR_PAGE_XPATH 		= "/ds/var/page";
var DATA_XPATH 			= "/ds/ManageCase";
var REF_DATA_XPATH 		= "/ds/var/form/ReferenceData";

var request = null, output = null, __tabIdx = 300, _initForm = false;

function enterVariableData() {}

enterVariableData.initialise = function() {
	_initForm = true;
    if (null != WP &amp;&amp; null != WP.GetScreenProcess &amp;&amp; null != WP.GetScreenProcess()) {
	msg = "EnterVariableData.js initForm() ";
	var process = WP.GetScreenProcess();
	var output  = process.getOutput();
	CaseManWPProcessStep__LoadData.TransferUserDetails(process);
	var parties = WP.GetQA_HeaderParties(process);
	var noOfParties = parties.length;
	var newParties = new Array();
	var screenType = WP.GetQA_ScreenType(process);
	if ("CO" == screenType) {
		var doc = parties[0].ownerDocument;
		var partiesNode = doc.createElement("Parties");
		var creditors = 0, debitors = 0;
		for (var i=0; i &lt; noOfParties; i++) {
			var party = parties[i];
			var newParty = doc.createElement("LitigiousParty");
			var type = null, numb = null, name = null;
			if ("Creditor" == party.nodeName) {
				type = CMC.PartyTypeCodesEnum.CREDITOR;
				creditors++; numb = creditors;
				name = WPS.getNodeTextContent(party.selectSingleNode("Name")); } 
			else {
				if ("Debtor" == party.nodeName) {
					type = CMC.PartyTypeCodesEnum.DEBTOR;
					debitors++; numb = debitors;
					name = WPS.getNodeTextContent(party.selectSingleNode("DebtorName")); } 
				else {
					if ("Employer" == party.nodeName) {
					type = CMC.PartyTypeCodesEnum.EMPLOYER; numb = 1
					name = WPS.getNodeTextContent(party.selectSingleNode("Name")); } } }
			var type2Node = doc.createElement("Type");
				type2Node.appendChild(doc.createTextNode(party.nodeName));
			var typeNode = doc.createElement("TypeCode");
				typeNode.appendChild(doc.createTextNode(type));
			var numbNode = doc.createElement("Number");
				numbNode.appendChild(doc.createTextNode(numb));
			var nameNode = doc.createElement("Name");
			if( null != name) nameNode.appendChild(doc.createTextNode(name));
			newParty.appendChild(type2Node);
			newParty.appendChild(typeNode);
			newParty.appendChild(numbNode);
			newParty.appendChild(nameNode);
			newParties[i] = newParty; } }
	else if ("Warrant" == screenType) {
		var doc = parties[0].ownerDocument;
		var partiesNode = doc.createElement("Parties");
		var partyFor = 0, partiesAgainst = 0, creditors = 0, debitors = 0;
		for (var i=0; i &lt; noOfParties; i++) {
			var party = parties[i];
			var newParty = doc.createElement("LitigiousParty");
			var type = null, numb = null, name = null, type2 = "";
			if ("Claimant" == party.nodeName) {
				type = CMC.PartyTypeCodesEnum.CLAIMANT;
				creditors++; numb = creditors;
				name = WPS.getNodeTextContent(party.selectSingleNode("Name"));
				type2 = "Party For"; }
			else {
				if ("Defendant1" == party.nodeName) {
					type = CMC.PartyTypeCodesEnum.DEFENDANT;
					debitors++; numb = debitors;
					name = WPS.getNodeTextContent(party.selectSingleNode("Name"));
					type2 = "Party Against 1"; } 
				else {
					if ("Defendant2" == party.nodeName) {
						type = CMC.PartyTypeCodesEnum.DEFENDANT; numb = 1;
						name = WPS.getNodeTextContent(party.selectSingleNode("Name"));
						type2 = "Party Against 2"; } } }
			var type2Node = doc.createElement("Type");
				type2Node.appendChild(doc.createTextNode(type2));
			var typeNode = doc.createElement("TypeCode");
				typeNode.appendChild(doc.createTextNode(type));
			var numbNode = doc.createElement("Number");
				numbNode.appendChild(doc.createTextNode(numb));
			var nameNode = doc.createElement("Name");
			if( null != name) nameNode.appendChild(doc.createTextNode(name));
			newParty.appendChild(type2Node);
			newParty.appendChild(typeNode);
			newParty.appendChild(numbNode);
			newParty.appendChild(nameNode);
			newParties[i] = newParty; }	}
	else {
		newParties = parties; }		
	for (var i=0; i &lt; noOfParties; i++) {
		var party = newParties[i];
		Services.addNode(party.cloneNode(true), REF_DATA_XPATH+"/Parties"); }	
	Services.setValue(Header_CaseNumber.wptr, "update");
	Services.setValue(Header_Parties.wptr, "update");
	Services.setValue(Header_ScreenType.wptr, "update");
	Services.setValue(Header_Order.dataBinding, output.getCJRReference() + " - " + output.getDescription()); } }
		
function Header_CaseNumber() {}
Header_CaseNumber.dataBinding 			= "/ds/EnterVariableData/QAScreenHeaderNumber";
Header_CaseNumber.wptr					= "/ds/EnterVariableData/TriggerQAScreenHeaderNumberUpdate";
Header_CaseNumber.isReadOnly 			= function() { return true; }
Header_CaseNumber.logicOn				= [ Header_CaseNumber.wptr ];
Header_CaseNumber.logic					= function() { 
	var number = WP.GetQA_HeaderNumber(WP.GetScreenProcess());
	Services.setValue(Header_CaseNumber.dataBinding, number);  }

function Header_ScreenType() {}
Header_ScreenType.dataBinding 			= "/ds/EnterVariableData/QAScreenHeaderType";
Header_ScreenType.wptr 					= "/ds/EnterVariableData/TriggerQAScreenHeaderTypeUpdate";
Header_ScreenType.isReadOnly 			= function() { return true; }
Header_ScreenType.logicOn				= [ Header_ScreenType.wptr ];
Header_ScreenType.logic					= function() { 
	var screenTypeCode = WP.GetQA_ScreenType(WP.GetScreenProcess());
	if ("Case" == screenTypeCode)  {  		screentype = "Case Number"; } 
	else if ("CO" == screenTypeCode) {  	screentype = "CO Number"; }
	else if ("Warrant" == screenTypeCode) {	screentype = "Warrant Case"; }
	Services.setValue(Header_ScreenType.dataBinding, screentype);  }

function Header_Parties() {}
Header_Parties.dataBinding 				= "/ds/EnterVariableData/QAScreenHeaderParties";
Header_Parties.wptr 					= "/ds/EnterVariableData/TriggerQAScreenHeaderPartiesUpdate";
Header_Parties.isReadOnly 				= function() { return true; }
Header_Parties.logicOn					= [ Header_Parties.wptr ];
Header_Parties.logic					= function() { 
	var screenTypeCode = WP.GetQA_ScreenType(WP.GetScreenProcess());
	if ("Case" == screenTypeCode)  { 		screentype = "Parties on Case"; } 
	else if ("CO" == screenTypeCode) { 		screentype = "Parties on CO"; }
	else if ("Warrant" == screenTypeCode) {	screentype = "Parties on Warrant"; }
	Services.setValue(Header_Parties.dataBinding, screentype);  }

function Header_PartyTypeListGrid() {};
Header_PartyTypeListGrid.tabIndex 		= 2;
Header_PartyTypeListGrid.dataBinding 	= VAR_PAGE_XPATH + "/SelectedGridRow/SelectedParty";
Header_PartyTypeListGrid.isReadOnly		= function() { return true; }
Header_PartyTypeListGrid.srcData 		= REF_DATA_XPATH + "/Parties";
Header_PartyTypeListGrid.rowXPath 		= "LitigiousParty[./TypeCode = '" 
														+CMC.PartyTypeCodesEnum.CLAIMANT + "' or ./TypeCode = '" 
														+CMC.PartyTypeCodesEnum.DEFENDANT + "' or ./TypeCode = '" 
														+CMC.PartyTypeCodesEnum.PART_20_DEFENDANT + "' or ./TypeCode = '" 
														+CMC.PartyTypeCodesEnum.PART_20_CLAIMANT + "' or ./TypeCode = '"
														+CMC.PartyTypeCodesEnum.CREDITOR + "' or ./TypeCode = '" 
														+CMC.PartyTypeCodesEnum.DEBTOR + "' or ./TypeCode = '" 
														+CMC.PartyTypeCodesEnum.TRUSTEE + "' or ./TypeCode = '"
														+CMC.PartyTypeCodesEnum.INSOLVENCY_PRACTITIONER + "' or ./TypeCode = '"
														+CMC.PartyTypeCodesEnum.APPLICANT + "' or ./TypeCode = '"
														+CMC.PartyTypeCodesEnum.PETITIONER + "' or ./TypeCode = '"
														+CMC.PartyTypeCodesEnum.THE_COMPANY + "' or ./TypeCode = '"
														+CMC.PartyTypeCodesEnum.OFFICIAL_RECEIVER + "' or ./TypeCode = ''"
														 +"]";
Header_PartyTypeListGrid.keyXPath 		= "PartyId";
Header_PartyTypeListGrid.columns 		= [	{xpath: "Type"},
											{xpath: "Number", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
											{xpath: "Name"}];

function Header_Order() {}
Header_Order.dataBinding 		= "/ds/EnterVariableData/OrderTitle";
Header_Order.isReadOnly			= function() { return true; }

var onSave = new Array();
		</xsl:text>
		
		<xsl:for-each select="GroupId">
			<xsl:variable name="thisGroupId">
				<xsl:value-of select="."/>
			</xsl:variable>
			<xsl:variable name="thisGroupFile">./Grouping.xml</xsl:variable>
			<xsl:text>
		/** SCR: </xsl:text><xsl:value-of select="$thisScreenId"/><xsl:text>  | GRP: </xsl:text><xsl:value-of select="$thisGroupId"/><xsl:text> | GFI: </xsl:text><xsl:value-of select="$thisGroupFile"/><xsl:text> **/</xsl:text>
		<xsl:variable name="groupFileLocation" select="string(concat($webfileDir, 'EnterVariableData\_Generic\Groups\', $thisGroupId, '.xml'))"/>
		<xsl:variable name="groupFileExists" select="boolean(document($groupFileLocation))"/>			
		<xsl:choose>
			<xsl:when test="$groupFileExists">	
				<xsl:variable name="groupFileDOC" select="document($groupFileLocation)"/>
				<xsl:value-of select="$groupFileDOC/Group/JavaScript"/>
				<xsl:if test="$groupFileDOC/Group/Protocols/OnSave">
					<xsl:for-each select="$groupFileDOC/Group/Protocols/OnSave/function">
						<xsl:variable name="ftie"><xsl:value-of select="$groupFileDOC/Group/Protocols/OnSave/function"/></xsl:variable>
						<xsl:variable name="cbck"><xsl:value-of select="$groupFileDOC/Group/Protocols/OnSave/functionCallback"/></xsl:variable>
						<xsl:text>onSave.push(['</xsl:text><xsl:value-of select="$ftie"/><xsl:text>','</xsl:text><xsl:value-of select="$cbck"/><xsl:text>']);</xsl:text>
					</xsl:for-each>
				</xsl:if>	

			</xsl:when>
			<xsl:otherwise>
				<xsl:text>/** no group specific code found on </xsl:text><xsl:value-of select="$groupFileLocation"/><xsl:text>. **/</xsl:text>
			</xsl:otherwise>		
		</xsl:choose>
			<xsl:for-each select="document($thisGroupFile)/Groups/Group[@GroupId=$thisGroupId]/QuestionId">
				<xsl:variable name="thisQuestionId">
					<xsl:value-of select="."/>
				</xsl:variable>
				<xsl:variable name="thisQuestionFile">
					<xsl:text>./Questions/</xsl:text>
					<xsl:value-of select="$thisQuestionId"/>
					<xsl:text>.xml</xsl:text>
				</xsl:variable>
				<xsl:text>
		/** Q: </xsl:text><xsl:value-of select="$thisQuestionId"/><xsl:text> **/			
		</xsl:text>
				<xsl:call-template name="generateQuestionDefinitionsForScreen">
					<xsl:with-param name="currentQuestionFile">
						<xsl:value-of select="$thisQuestionFile"/>
					</xsl:with-param>
					<xsl:with-param name="currentScreenId">
						<xsl:value-of select="$thisScreenId"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:for-each>
		</xsl:for-each>
		
		<xsl:for-each select="GroupId">
			<xsl:variable name="thisGroupId">
				<xsl:value-of select="."/>
			</xsl:variable>
			<xsl:variable name="thisGroupFile">./Grouping.xml</xsl:variable>
			<xsl:text>
		    /** SCR: </xsl:text><xsl:value-of select="$thisScreenId"/><xsl:text> | GRP: </xsl:text><xsl:value-of select="$thisGroupId"/><xsl:text> | GFI: </xsl:text><xsl:value-of select="$thisGroupFile"/><xsl:text> **/
			</xsl:text>
			<xsl:for-each select="document($thisGroupFile)/Groups/Group[@GroupId=$thisGroupId]/QuestionId">
				<xsl:variable name="thisQuestionId">
					<xsl:value-of select="."/>
				</xsl:variable>
				<xsl:variable name="thisQuestionFile">
					<xsl:text>./Questions/</xsl:text>
					<xsl:value-of select="$thisQuestionId"/>
					<xsl:text>.xml</xsl:text>
				</xsl:variable>
				<xsl:text>
		/** Q: </xsl:text><xsl:value-of select="$thisQuestionFile"/><xsl:text> **/			
		</xsl:text>
				<xsl:call-template name="generateQuestionsForScreen">
					<xsl:with-param name="currentQuestionFile">
						<xsl:value-of select="$thisQuestionFile"/>
					</xsl:with-param>
					<xsl:with-param name="currentScreenId">
						<xsl:value-of select="$thisScreenId"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:for-each>
		</xsl:for-each>
		<xsl:text>

function ProgressBar_SubForm() {}
ProgressBar_SubForm.subformName = "CasemanWpOrarepProgress";

function Status_SaveButton() {}
Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "enterVariableData" } ] } }
		
Status_SaveButton.tabIndex = __tabIdx++;
Status_SaveButton.actionBinding = function() {
	invalidFields = FormController.getInstance().validateForm(true, false);
	if (invalidFields.length == 0) {	
		Save_All_QA_Data(); } }

function Save_All_QA_Data() {
	try { CaseManWPProcessStep.RaiseProgressBar(); } 
	catch(err) { if (doLog) do_Log("Error raising progressbar during QA SaveAll()" + err); }
	waitForPopupToOpen(); }

function waitForPopupToOpen() {
	var open = false;
	var process = WP.GetScreenProcess();
	var x = WP.GetState(process,"ProgressBarUp");
	if ("true" == x || true == x) open = true;
	if (true == open) {
		if ("335" != WPU.getCaseOwningCourt()) {
			Save_QA_Only(); }
		else {
			var output = process.getOutput();
			if (true == output.getDoCCBC()) {
				Save_QA_Only(); }
			else {
				Save_All();	} } }
	else {
		setTimeout("waitForPopupToOpen()",333); } }

function Save_QA_Only() {
	vardata = Services.getNode("/ds/EnterVariableData");
	var QAdom = XML.createDOM();
	QAdom.loadXML("&lt;ds&gt;"+vardata.xml+"&lt;/ds&gt;");
	var process   = WP.GetScreenProcess();
	var output    = process.getOutput();
    WPU.filterTextAreaTextNodes(QAdom);
	WP.SetState(process, 'qaDOM', QAdom);
	var context = process.getRequest().getContext();
	var contextDOM 	= WPS.createDOM(null,null,null);
	contextDOM.loadXML(context.xml);
	var xmlDs   = WP.GetState(process, 'dsDOM');
	var dsDOM   = XML.createDOM();
	dsDOM.loadXML ("&lt;variabledata&gt;&lt;/variabledata&gt;");
	var DataNodes = xmlDs.selectNodes("/params/param[@name='xml']/*");
	var DataNodesLen = DataNodes.length;
	var vardat = dsDOM.selectSingleNode("/variabledata"); 
	for (var i=1; i &lt; DataNodesLen; i++) {
		vardat.appendChild(DataNodes[i].cloneNode(true)); }
	vardat.appendChild(vardata.cloneNode(true));
	var params 		= new NonFormServiceParams();
	params.addSimpleParameter('output', '' + output.getCJRReference());
	params.addSimpleParameter('outputUniqueID', '' + output.getUniqueId());
	params.addSimpleParameter('storingUser', '' + WPS.GetUserName());	
	params.addDOMParameter('xml',dsDOM );	
	params.addDOMParameter('context', contextDOM);
	Services.callService("setNoticeOfIssueData", params, Save_QA_Only_Callback, true); }
	
function Save_QA_Only_Callback() { }

Save_QA_Only_Callback.onSuccess = function(dom) {   
	if (null != dom) {   
		Save_All(); }
	else {
		alert(Messages.NO_RESULTS_MESSAGE); } }

Save_QA_Only_Callback.onBusinessException = function(exception) {
	alert(Messages.FAILEDSAVE_MESSAGE); }

Save_QA_Only_Callback.onSystemException = function(exception) {
	alert(Messages.FAILEDSAVE_MESSAGE); }			

function Save_All() {
	if (onSave.length &gt; 0) {					
		Save_QAEntities(); }
	else {			
		Save_EnterVarialbeData(); } }
	
function Save_EnterVarialbeData() {
	var process   = WP.GetScreenProcess();
	if ("335" != WPU.getCaseOwningCourt()) {
		WP.SetState(process, 'QADone', true ); }
	else {
		var output = process.getOutput();
		if (true == output.getDoCCBC()) {
			WP.SetState(process, 'QADone', true ); }
		else {
			top.WPError.FinishProcess(process);	} } }

function Save_QAEntities() {
	var saveEntity = onSave.shift()
	if (null != saveEntity) {
		var ftie = saveEntity[0];
		var cbck = saveEntity[1];
		var successForGroup = eval(ftie+"()"); 
		if (false == successForGroup) {
			try { CaseManWPProcessStep.LowerProgressBar(WP.GetScreenProcess()); } 
			catch(err) { if (doLog) do_Log("Error raising progressbar during QA SaveAll()" + err); } } } }
 		</xsl:text>
	</xsl:template>
	<xsl:template name="generateQuestionsForScreen">
		<xsl:param name="currentQuestionFile"/>
		<xsl:param name="currentScreenId"/>
		<xsl:for-each select="document($currentQuestionFile)/Question">
			<xsl:variable name="questionobjectname"><xsl:value-of select="ObjectName"/></xsl:variable>
			<xsl:call-template name="Question">
				<xsl:with-param name="objectName">
					<xsl:value-of select="$questionobjectname"/>
				</xsl:with-param>
				<xsl:with-param name="questionType">
					<xsl:variable name="lcletters">abcdefghijklmnopqrstuvwxyz</xsl:variable>
					<xsl:variable name="ucletters">ABCDEFGHIJKLMNOPQRSTUVWXYZ</xsl:variable>
					<xsl:variable name="toconvert"><xsl:value-of select="Html//input[@id = $questionobjectname]/@type"/></xsl:variable>					
					<xsl:value-of select="translate($toconvert,$ucletters,$lcletters)"/>
				</xsl:with-param>
				<xsl:with-param name="componentName">
					<xsl:choose>
						<xsl:when test="Javascript/componentName = '##label##'">														
							<xsl:choose>
								<xsl:when test="Context[@screenId=$currentScreenId]/Label">
									<xsl:value-of select="Context[@screenId=$currentScreenId]/Label"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="Label"/>									
								</xsl:otherwise>								
							</xsl:choose>							
						</xsl:when>
						<xsl:otherwise>
							<xsl:choose>																
								<xsl:when test="Javascript/componentName and Javascript/componentName != ''">
									<xsl:value-of select="Javascript/componentName"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:choose>
										<xsl:when test="Context[@screenId=$currentScreenId]/Label">
											<xsl:value-of select="Context[@screenId=$currentScreenId]/Label"/>
										</xsl:when>
										<xsl:otherwise>
											<xsl:value-of select="Label"/>									
										</xsl:otherwise>								
									</xsl:choose>							
								</xsl:otherwise>
							</xsl:choose>							
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="dataBinding">
					<xsl:value-of select="Javascript/XPath"/>
				</xsl:with-param>
				<xsl:with-param name="srcData"/>
				<xsl:with-param name="rowXPath"/>
				<xsl:with-param name="keyXPath"/>
				<xsl:with-param name="displayXPath"/>
				<xsl:with-param name="hintText">
					<xsl:choose>
						<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]">	
							<xsl:choose>
								<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]/HintText">
									<xsl:value-of select="Javascript/Context[@ScreenId = $currentScreenId]/HintText"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="Javascript/HintText"/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="Javascript/HintText"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="maxLength">
					<xsl:choose>
						<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]">
							<xsl:choose>
								<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]/maxLength">
								<xsl:value-of select="Javascript/Context[@ScreenId = $currentScreenId]/maxLength"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="Javascript/maxLength"/>
								</xsl:otherwise>
							</xsl:choose>	
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="Javascript/maxLength"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="mandatoryOn">
					<xsl:choose>
						<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]">
							<xsl:choose>
								<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]/mandatoryOn">
								<xsl:value-of select="Javascript/Context[@ScreenId = $currentScreenId]/mandatoryOn"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="Javascript/mandatoryOn"/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="Javascript/mandatoryOn"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="isMandatory">
					<xsl:choose>
						<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]">
							<xsl:choose>
								<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]/isMandatory">
								<xsl:value-of select="Javascript/Context[@ScreenId = $currentScreenId]/isMandatory"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="Javascript/isMandatory"/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="Javascript/isMandatory"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="validateOn">
					<xsl:choose>
						<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]">
							<xsl:choose>
							<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]/validateOn">
								<xsl:value-of select="Javascript/Context[@ScreenId = $currentScreenId]/validateOn"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="Javascript/validateOn"/>
							</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="Javascript/validateOn"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="validate">
					<xsl:choose>
						<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]">
							<xsl:choose>
							<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]/validate">
							   <xsl:value-of select="Javascript/Context[@ScreenId = $currentScreenId]/validate"/>
							</xsl:when>
							<xsl:otherwise>
							  <xsl:value-of select="Javascript/validate"/>
							</xsl:otherwise>
							</xsl:choose>
						</xsl:when>						  
						<xsl:otherwise>
							<xsl:value-of select="Javascript/validate"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="initialise">
					<xsl:choose>
						<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]">
							<xsl:choose>
							<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]/initialise">
							   <xsl:value-of select="Javascript/Context[@ScreenId = $currentScreenId]/initialise"/>
							</xsl:when>
							<xsl:otherwise>
							  <xsl:value-of select="Javascript/initialise"/>
							</xsl:otherwise>
							</xsl:choose>
						</xsl:when>						  
						<xsl:otherwise>
							<xsl:value-of select="Javascript/initialise"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="readOnlyOn">
					<xsl:choose>
						<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]">
							<xsl:choose>
							<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]/readOnlyOn">
								<xsl:value-of select="Javascript/Context[@ScreenId = $currentScreenId]/readOnlyOn"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="Javascript/readOnlyOn"/>
							</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="Javascript/readOnlyOn"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="isReadOnly">
					<xsl:choose>
						<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]">
							<xsl:choose>
							<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]/isReadOnly">
							   <xsl:value-of select="Javascript/Context[@ScreenId = $currentScreenId]/isReadOnly"/>
							</xsl:when>
							<xsl:otherwise>
							  <xsl:value-of select="Javascript/isReadOnly"/>
							</xsl:otherwise>
							</xsl:choose>
						</xsl:when>						  
						<xsl:otherwise>
							<xsl:value-of select="Javascript/isReadOnly"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="logicOn">
					<xsl:choose>
						<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]">
							<xsl:choose>
						  <xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]/logicOn">
							<xsl:value-of select="Javascript/Context[@ScreenId = $currentScreenId]/logicOn"/>
					      </xsl:when>
					      <xsl:otherwise>
								<xsl:value-of select="Javascript/logicOn"/>
							</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="Javascript/logicOn"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="logic">
					<xsl:choose>
						<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]">
							<xsl:choose>
								
						  <xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]/logic">
							<xsl:value-of select="Javascript/Context[@ScreenId = $currentScreenId]/logic"/>
						  </xsl:when>
						  <xsl:otherwise>
							  <xsl:value-of select="Javascript/logic"/>
							</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="Javascript/logic"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="enableOn">
					<xsl:choose>
						<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]">
							<xsl:choose>
						  <xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]/enableOn">
							<xsl:value-of select="Javascript/Context[@ScreenId = $currentScreenId]/enableOn"/>
						  </xsl:when>
					      <xsl:otherwise>
								<xsl:value-of select="Javascript/enableOn"/>
						  </xsl:otherwise>
						  </xsl:choose>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="Javascript/enableOn"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="enabled">
					<xsl:choose>
						<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]">
							<xsl:choose>
						  		<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]/enabled">						
									<xsl:value-of select="Javascript/Context[@ScreenId = $currentScreenId]/enabled"/>
								  </xsl:when>
								  <xsl:otherwise>
									  <xsl:value-of select="Javascript/enabled"/>
								  </xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="Javascript/enabled"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="isEnabled">
					<xsl:choose>
						<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]">
						  <xsl:choose>
						  		<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]/isEnabled">
								<xsl:value-of select="Javascript/Context[@ScreenId = $currentScreenId]/isEnabled"/>
							  </xsl:when>
							  <xsl:otherwise>
								  <xsl:value-of select="Javascript/isEnabled"/>
							  </xsl:otherwise>
						  </xsl:choose>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="Javascript/isEnabled"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="postSetValue">
					<xsl:choose>
						<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]">
							<xsl:choose>
								<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]/postSetValue">
								<xsl:value-of select="Javascript/Context[@ScreenId = $currentScreenId]/postSetValue"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="Javascript/postSetValue"/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="Javascript/postSetValue"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="transformToModel">
					<xsl:choose>
						<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]">
							<xsl:choose>
							<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]/transformToModel">
								<xsl:value-of select="Javascript/Context[@ScreenId = $currentScreenId]/transformToModel"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="Javascript/transformToModel"/>	
							</xsl:otherwise>
						</xsl:choose>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="Javascript/transformToModel"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="transformToDisplay">
					<xsl:choose>
						<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]">
							<xsl:choose>
								<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]/transformToDisplay">
									<xsl:value-of select="Javascript/Context[@ScreenId = $currentScreenId]/transformToDisplay"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="Javascript/transformToDisplay"/>
								</xsl:otherwise>				
							</xsl:choose>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="Javascript/transformToDisplay"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="modelValue">
					<xsl:choose>
						<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]">
							<xsl:choose>
								<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]/modelValue">
								<xsl:value-of select="Javascript/Context[@ScreenId = $currentScreenId]/modelValue"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="Javascript/modelValue"/>
								</xsl:otherwise>
							</xsl:choose>
							
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="Javascript/modelValue"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
				<xsl:with-param name="miscCode">
					<xsl:choose>
						<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]">
							<xsl:choose>
								<xsl:when test="Javascript/Context[@ScreenId = $currentScreenId]/miscCode">
							  		<xsl:value-of select="Javascript/miscCode"/>
									<xsl:value-of select="Javascript/Context[@ScreenId = $currentScreenId]/miscCode"/>							
							  	</xsl:when>
							  	<xsl:otherwise>
								  	<xsl:value-of select="Javascript/miscCode"/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:when>						
						<xsl:otherwise>
							<xsl:value-of select="Javascript/miscCode"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:for-each>
	</xsl:template>
	
	<xsl:template name="generateQuestionDefinitionsForScreen">
		<xsl:param name="currentQuestionFile"/>
		<xsl:param name="currentScreenId"/>
		<xsl:for-each select="document($currentQuestionFile)/Question">
			<xsl:call-template name="QuestionDefinition">
				<xsl:with-param name="objectName">
					<xsl:value-of select="ObjectName"/>
				</xsl:with-param>
				<xsl:with-param name="dataBinding">
					<xsl:value-of select="Javascript/XPath"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:for-each>
	</xsl:template>
	
	<xsl:template name="Question">
		<xsl:param name="objectName"/>
		<xsl:param name="questionType"/>
		<xsl:param name="componentName"/>
		<xsl:param name="maxLength"/>
		<xsl:param name="dataBinding"/>
		<xsl:param name="srcData">null</xsl:param>
		<xsl:param name="rowXPath">null</xsl:param>
		<xsl:param name="keyXPath">null</xsl:param>
		<xsl:param name="displayXPath">null</xsl:param>
		<xsl:param name="hintText"/>
		<xsl:param name="mandatoryOn"/>
		<xsl:param name="isMandatory"/> 
		<xsl:param name="validateOn"/>
		<xsl:param name="validate"/>
		<xsl:param name="initialise"/>		
		<xsl:param name="readOnlyOn"/>
		<xsl:param name="isReadOnly"/>				
		<xsl:param name="logicOn"/>
		<xsl:param name="logic"/>
		<xsl:param name="enableOn"/>
		<xsl:param name="enabled"/>
		<xsl:param name="isEnabled"/>
		<xsl:param name="postSetValue"/>
		<xsl:param name="transformToModel"/>
		<xsl:param name="transformToDisplay"/>
		<xsl:param name="modelValue"/>
		<xsl:param name="miscCode"/>
		<xsl:value-of select="$objectName"/>
		<xsl:text>.tabIndex = __tabIdx++;
		</xsl:text>
		<xsl:value-of select="$objectName"/>
		<xsl:text>.componentName = "</xsl:text>
		<xsl:value-of select="$componentName"/>	
		<xsl:text>";
		</xsl:text>
		<xsl:choose>
			<xsl:when test="$srcData = ''">
				<xsl:value-of select="$objectName"/>
				<xsl:text>.srcData = null;
		</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$objectName"/>
				<xsl:text>.srcData = </xsl:text>
				<xsl:value-of select="$srcData"/>
				<xsl:text>;
		</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="$rowXPath = ''">
				<xsl:value-of select="$objectName"/>
				<xsl:text>.rowXPath = null;
		</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$objectName"/>
				<xsl:text>.rowXPath = </xsl:text>
				<xsl:value-of select="$rowXPath"/>
				<xsl:text>;
		</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="$keyXPath = ''">
				<xsl:value-of select="$objectName"/>
				<xsl:text>.keyXPath = null;
		</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$objectName"/>
				<xsl:text>.keyXPath = </xsl:text>
				<xsl:value-of select="$keyXPath"/>
				<xsl:text>;
		</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="$displayXPath = ''">
				<xsl:value-of select="$objectName"/>
				<xsl:text>.displayXPath = null;
		</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$objectName"/>
				<xsl:text>.displayXPath =</xsl:text>
				<xsl:value-of select="$displayXPath"/>
				<xsl:text>;
		</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="$hintText = ''">
				<xsl:value-of select="$objectName"/>
				<xsl:text>.helpText = null;
		</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$objectName"/>
				<xsl:text>.helpText = "</xsl:text>
				<xsl:value-of select="$hintText"/>
				<xsl:text>";
		</xsl:text>
			</xsl:otherwise>
		</xsl:choose>				
		<xsl:choose>
			<xsl:when test="$maxLength != ''">
				<xsl:value-of select="$objectName"/>
				<xsl:text>.maxLength = </xsl:text>
				<xsl:value-of select="$maxLength"/>
				<xsl:text>;
			</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="$questionType = 'text'">
						<xsl:value-of select="$objectName"/>
				<xsl:text>.maxLength = 80;
			</xsl:text>
					</xsl:when>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>		
		<xsl:if test="$mandatoryOn != ''">
			<xsl:value-of select="$objectName"/>
			<xsl:text>.mandatoryOn = [</xsl:text>
			<xsl:value-of select="$mandatoryOn"/>
			<xsl:text>];
		</xsl:text>
		</xsl:if>
		<xsl:if test="$isMandatory != ''">
			<xsl:value-of select="$objectName"/>
			<xsl:text>.isMandatory = function()	{</xsl:text>
			<xsl:value-of select="$isMandatory"/>
			<xsl:text> }
		</xsl:text>
		</xsl:if>
		<xsl:if test="$validateOn != ''">
			<xsl:value-of select="$objectName"/>
			<xsl:text>.validateOn = [</xsl:text>
			<xsl:value-of select="$validateOn"/>
			<xsl:text>];
		</xsl:text>
		</xsl:if>
		<xsl:if test="$validate != ''">
			<xsl:value-of select="$objectName"/>
			<xsl:text>.validate = function(value) {</xsl:text>
			<xsl:value-of select="$validate"/>
			<xsl:text> }
		</xsl:text>
		</xsl:if>		
		
		<xsl:if test="$initialise != ''">
			<xsl:value-of select="$objectName"/>
			<xsl:text>.initialise = function() { if (null != WP &amp;&amp; null != WP.GetScreenProcess &amp;&amp; null != WP.GetScreenProcess()) {</xsl:text>
			<xsl:value-of select="$initialise"/>
			<xsl:text> } }
		</xsl:text>
		</xsl:if>
		
		<xsl:if test="$readOnlyOn != ''">
			<xsl:value-of select="$objectName"/>
			<xsl:text>.readOnlyOn = [</xsl:text>
			<xsl:value-of select="$readOnlyOn"/>
			<xsl:text>];
		</xsl:text>
		</xsl:if>
		<xsl:if test="$isReadOnly != ''">
			<xsl:value-of select="$objectName"/>
			<xsl:text>.isReadOnly = function(value)	{</xsl:text>
			<xsl:value-of select="$isReadOnly"/>
			<xsl:text> }
		</xsl:text>
		</xsl:if>		
		<xsl:if test="$logicOn != ''">
			<xsl:value-of select="$objectName"/>
			<xsl:text>.logicOn = [</xsl:text>
			<xsl:value-of select="$logicOn"/>
			<xsl:text>];
		</xsl:text>
		</xsl:if>
		<xsl:if test="$logic != ''">
			<xsl:value-of select="$objectName"/>
			<xsl:text>.logic = function(event) {</xsl:text>
			<xsl:value-of select="$logic"/>
			<xsl:text> }
		</xsl:text>
		</xsl:if>
		<xsl:if test="$enableOn != ''">
			<xsl:value-of select="$objectName"/>
			<xsl:text>.enableOn = [</xsl:text>
			<xsl:value-of select="$enableOn"/>
			<xsl:text>];
		</xsl:text>
		</xsl:if>
		<xsl:if test="$enabled != ''">
			<xsl:value-of select="$objectName"/>
			<xsl:text>.enabled = function() {</xsl:text>
			<xsl:value-of select="$enabled"/>
			<xsl:text> }
		</xsl:text>
		</xsl:if>
		<xsl:if test="$isEnabled != ''">
			<xsl:value-of select="$objectName"/>
			<xsl:text>.isEnabled = function() {</xsl:text>
			<xsl:value-of select="$isEnabled"/>
			<xsl:text> }
		</xsl:text>
		</xsl:if>
		<xsl:if test="$postSetValue != ''">
			<xsl:value-of select="$objectName"/>
			<xsl:text>.postSetValue = function(valid, value) {</xsl:text>
			<xsl:value-of select="$postSetValue"/>
			<xsl:text> }
		</xsl:text>
		</xsl:if>
		<xsl:if test="$transformToModel != ''">
			<xsl:value-of select="$objectName"/>
			<xsl:text>.transformToModel = function(value) {</xsl:text>
			<xsl:value-of select="$transformToModel"/>
			<xsl:text> }
		</xsl:text>
		</xsl:if>
		<xsl:if test="$transformToDisplay != ''">
			<xsl:value-of select="$objectName"/>
			<xsl:text>.transformToDisplay = function(value) {</xsl:text>
			<xsl:value-of select="$transformToDisplay"/>
			<xsl:text> }
		</xsl:text>
		</xsl:if>
		<xsl:if test="$modelValue != ''">
			<xsl:value-of select="$objectName"/>
			<xsl:text>.modelValue = { </xsl:text><xsl:value-of select="$modelValue"/> <xsl:text> };</xsl:text>
		</xsl:if>
		<xsl:if test="$miscCode != ''">
			<xsl:text>/** Misc Code for question </xsl:text><xsl:value-of select="$objectName"/><xsl:text> support**/
		</xsl:text>
			<xsl:value-of select="$miscCode"/>
			<xsl:text>/** End of Misc Code for question </xsl:text>
			<xsl:value-of select="$objectName"/>
			<xsl:text> support **/</xsl:text>
		</xsl:if>		

		/** End of <xsl:value-of select="$objectName"/> **/
				
	</xsl:template>
	<xsl:template name="QuestionDefinition">
		<xsl:param name="objectName"/>
		<xsl:param name="dataBinding"/>
		<xsl:text>function </xsl:text>
		<xsl:value-of select="$objectName"/>
		<xsl:text>() {}
		</xsl:text>
		<xsl:value-of select="$objectName"/>
		<xsl:text>.dataBinding = "</xsl:text>
		<xsl:value-of select="$dataBinding"/>
		<xsl:text>";
		</xsl:text>
	</xsl:template>
</xsl:stylesheet>
