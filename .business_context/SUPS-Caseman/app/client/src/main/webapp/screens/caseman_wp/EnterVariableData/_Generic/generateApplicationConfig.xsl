<?xml version="1.0" encoding="UTF-8"?>
<!--
	Change History:
	20/08/2010 - Chris Vincent, added update/insert Warrant Return services to WP forms.  Trac 3474
	12/12/2011 - Chris Vincent, added getCourtsShort refdata service to WP forms.  Trac 4621.
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:supsfo="http://eds.com/supsfo">
	
	<xsl:output method="xml" indent="yes"/>
	
	<xsl:param name="templateDir"/>
	<xsl:param name="webfileDir"/>
	
	<xsl:variable name="wpCfgXmlDocLoc">
		<xsl:value-of select="$webfileDir"/>
		<xsl:text>gen_wpctrl.xml</xsl:text>
	</xsl:variable>

	<xsl:variable name="wpCfgXmlDoc" select="document($wpCfgXmlDocLoc)"/>

	<xsl:template match="/">
		<xsl:apply-templates/>
	</xsl:template>
	
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="wpFormGeneration">
		<form name="WPEditor" pageURL="caseman_wp/WordProcessor/fwk/wpeditor.html" title="CaseMan Word Processor" precompile="no">
			<xsl:call-template name="getServices" />
			<mapping name="setXhtml" serviceName="setXhtml"/>
			<service name="setXhtml" cache="none" url="WpOutput" method="setXhtml">
				<param name="xml-document"/>
			</service>							
		</form>
		<form name="CasemanWpOrarepProgress" pageURL="caseman_wp_orarep_progress/ProgressBar_SubForm.html" title="Document Processing Progress" precompile="no">	
			<xsl:call-template name="getServices" />	
		</form>
		<xsl:for-each select="$wpCfgXmlDoc/configuration/outputs/output[QA = 'true']">									
			<xsl:variable name="outputId" select="Id"/>
			<xsl:element name="form">
				<xsl:attribute name="name">EnterVariableData_<xsl:value-of select="$outputId"/></xsl:attribute>
				<xsl:attribute name="pageURL">caseman_wp/EnterVariableData/generated/<xsl:value-of select="$outputId"/>.html</xsl:attribute>
				<xsl:attribute name="title">Enter Variable Data <xsl:value-of select="$outputId"/></xsl:attribute>
				<!--xsl:attribute name="precompile">no</xsl:attribute-->
				<xsl:call-template name="getServices" />	
			</xsl:element>																									
		</xsl:for-each>
	</xsl:template>
	
	<xsl:template name="getServices">
	
		<mapping name="getNoticeOfIssueData" serviceName="WordProcessing_NoticeOfIssue_getData"/>
			<service name="WordProcessing_NoticeOfIssue_getData" cache="none" url="Noticeofissue" method="getData"/>
			<mapping name="setNoticeOfIssueData" serviceName="WordProcessing_NoticeOfIssue_setData"/>
			<service name="WordProcessing_NoticeOfIssue_setData" cache="none" url="Noticeofissue" method="setData"/>
			<mapping name="getNoticeOfIssueTransformedData" serviceName="WordProcessing_NoticeOfIssue_getTransformData"/>
			<service name="WordProcessing_NoticeOfIssue_getTransformData" cache="none" url="Noticeofissue" method="getTransformData">
			</service>
			<mapping name="getOutputDocumentFlow" serviceName="WordProcessing_NoticeOfIssue_getOutputDocumentFlow" /> 
			<service name="WordProcessing_NoticeOfIssue_getOutputDocumentFlow" cache="none" url="Noticeofissue" method="getOutputDocumentFlow" /> 
			
			<mapping name="getCourts" serviceName="getCourts"/>
			<service name="getCourts" cache="GET" url="Court" method="getCourts"/>
			<mapping name="getCourtsShort" serviceName="getCourtsShort"/>
			<service name="getCourtsShort" cache="GET" url="Court" method="getCourtsShort" />

			<mapping name="maintainJudgment" serviceName="maintainJudgment"/>
			<service name="maintainJudgment" cache="none" url="Judgment" method="maintainJudgment">
				<param name="JudgmentSequence"/>
			</service>

			<mapping name="updateJudgment" serviceName="updateJudgment"/>
			<service name="updateJudgment" cache="none" url="Judgment" method="updateJudgment">
				<param name="JudgmentSequence"/>
			</service>

			<mapping name="updateHearing" serviceName="updateHearing"/>
			<service name="updateHearing" cache="none" url="Hearing" method="updateHearing"/>

			<mapping name="getNonWorkingDays" serviceName="getNonWorkingDays"/>
			<service name="getNonWorkingDays" cache="GET" url="NonWorkingDay" method="getNonWorkingDays"/>
			
			<mapping name="updateCase" serviceName="updateCase"/>
			<service name="updateCase" cache="none" url="Case" method="updateCase">
				<param name="caseNumber"/>
			</service>
			
			<mapping name="getHearing" serviceName="getHearing"/>
			<service name="getHearing" cache="none" url="Hearing" method="getHearing">
				<param name="caseNumber"/>
			</service>
			
			<mapping name="getHearingCO" serviceName="getHearingCO"/>
			<service name="getHearingCO" cache="none" url="Hearing" method="getHearingCO">
				<param name="coNumber"/>
			</service>
			
			<mapping name="getCaseAe" serviceName="getCaseAe"/>
			<service name="getCaseAe" cache="none" url="Ae" method="getCaseAe">
				<param name="caseNumber"/>
			</service>

			<mapping name="updateHra" serviceName="updateHra"/>
			<service name="updateHra" cache="none" url="Hra" method="updateHraDetails"/>	
			
			<mapping name="addCaseEvent" serviceName="addCaseEvent"/>
			<service name="addCaseEvent" cache="none" url="CaseEvent" method="addCaseEvent"/>
			
			<mapping name="updateCaseEventRegisterJudgment" serviceName="updateCaseEventRegisterJudgment"/>
			<service name="updateCaseEventRegisterJudgment" cache="none" url="CaseEvent" method="updateCaseEventRegisterJudgment"/>		
			
			<mapping name="getWft" serviceName="getWft"/>
			<service name="getWft" cache="none" url="WindowForTrial" method="getWft"/>
			
			<mapping name="addWarrantForCo" serviceName="addWarrantForCo"/>
			<service name="addWarrantForCo" cache="none" url="Warrant" method="addWarrantForCo"/>
			
			<mapping name="addWarrant" serviceName="addWarrant"/>
			<service name="addWarrant" cache="none" url="Warrant" method="addWarrant"/>
			
			<mapping name="updateCaseEventBms" serviceName="updateCaseEventBms"/>
			<service name="updateCaseEventBms" cache="none" url="CaseEvent" method="updateCaseEventBms"/>

			<mapping name="updateCaseEventDetails" serviceName="updateCaseEventDetails"/>
			<service name="updateCaseEventDetails" cache="none" url="CaseEvent" method="updateCaseEventDetails"/>

			<mapping name="validateCcbcJudgmentCost" serviceName="validateCcbcJudgmentCost"/>
			<service name="validateCcbcJudgmentCost" cache="none" url="Judgment" method="validateCcbcJudgmentCost">
				<param name="judgType"/>
				<param name="judgDate"/>
				<param name="judgAmount"/>
				
			</service>

			<mapping name="getCase" serviceName="getCase"/>
			<service name="getCase" cache="none" url="Case" method="getCase"/>
			
			<mapping name="addHearingCO" serviceName="addHearingCO"/>
			<service name="addHearingCO" cache="none" url="Hearing" method="addHearingCO"/>
			
			<mapping name="updateHearingCO" serviceName="updateHearingCO"/>
			<service name="updateHearingCO" cache="none" url="Hearing" method="updateHearingCO"/>
			
			<mapping name="getCoDebtList" serviceName="getCoDebtList"/>
			<service name="getCoDebtList" cache="none" url="Co" method="getCoDebtList"/>
			
			<mapping name="updateCoDebtList" serviceName="updateCoDebtList"/>
			<service name="updateCoDebtList" cache="none" url="Co" method="updateCoDebtList"/>
			
			<mapping name="addHearing" serviceName="addHearing"/>
			<service name="addHearing" cache="none" url="Hearing" method="addHearing"/>
			
			<mapping name="getCo" serviceName="getCo"/>
			<service name="getCo" cache="none" url="Co" method="getCo">
				<param name="coNumber"/>
			</service>
			
			<mapping name="updateCo" serviceName="updateCo"/>
			<service name="updateCo" cache="none" url="Co" method="updateCo"/>
			
			<mapping name="updateCoEvents" serviceName="updateCoEvents"/>
			<service name="updateCoEvents" cache="none" url="CoEvent" method="updateCoEvents">
				<param name="coEvents"/>
			</service>
	
			<mapping name="getCourt" serviceName="getCourt"/>
			<service name="getCourt" cache="none" url="Court" method="getCourt">
				<param name="qcourtid"/>
			</service>
			
			<mapping name="getCourtMaintain" serviceName="getCourtMaintain"/>
			<service name="getCourtMaintain" cache="none" url="Court" method="getCourtMaintain">
				<param name="courtCode"/>
			</service>

			<mapping name="createOutput" serviceName="wpOutputServiceCreateOutput"/>
			<service name="wpOutputServiceCreateOutput" cache="none" url="WpOutput" method="createOutput"/>
				
			<mapping name="getReport" serviceName="getReport"/>
		    <service name="getReport" cache="none" url="WpOutput" method="getReport"/>		

			<mapping name="getXhtml" serviceName="getXhtml"/>
			<service name="getXhtml" cache="none" url="WpOutput" method="getXhtml">
				<param name="documentId"/>
			</service>

			<mapping name="getData" serviceName="getData"/>
			<service name="getData" cache="none" url="WpOutput" method="getData">
				<param name="outputId"/>
			</service>

			<mapping name="setDocument" serviceName="setDocument"/>
			<service name="setDocument" cache="none" url="WpOutput" method="setDocument">
				<param name="documentId"/>
				<param name="outputId"/>
			</service>
			<mapping name="runReport" serviceName="runReport"/>
			<service name="runReport" cache="none" url="Reports" method="runReport"/> 			
			<mapping name="requestReport" serviceName="requestReport"/>
		    <service name="requestReport" cache="none" url="Reports" method="requestReport"/>	
			<mapping name="getReport" serviceName="getReport"/>
		    <service name="getReport" cache="none" url="Reports" method="getReport"/>
		    <mapping name="getWarrantReturns" serviceName="getWarrantReturns"/>
		    <service name="getWarrantReturns" cache="none" url="WarrantReturns" method="getWarrantReturns"/>								
			
			<mapping name="getSystemDate" serviceName="getSystemDate"/>
			<service name="getSystemDate" cache="GET" url="SystemDate" method="getSystemDate"/>
		
			<mapping name="updateCaseEventErrorOff" serviceName="updateCaseEventErrorOff"/>
			<service name="updateCaseEventErrorOff" cache="none" url="CaseEvent" method="updateCaseEventErrorOff">
				<param name="caseEventSeq"/>
			</service>
			
			<mapping name="insertWarrantReturns" serviceName="insertWarrantReturns"/>
			<service name="insertWarrantReturns" cache="none" url="WarrantReturns" method="insertWarrantReturns"/>
			<mapping name="updateWarrantReturns" serviceName="updateWarrantReturns"/>
			<service name="updateWarrantReturns" cache="none" url="WarrantReturns" method="updateWarrantReturns"/>
			
			<mapping name="getCaseJurisdiction" serviceName="getCaseJurisdiction"/>
			<service name="getCaseJurisdiction" cache="none" url="Case" method="getCaseJurisdiction" />
														
			<access>
				<role name="viewOnly"/>
				<role name="medium"/>
				<role name="high"/>
				<role name="wcSuper"/>
				<role name="scSuper"/>
				<role name="bmsSuper"/>		
				<role name="aeSuper"/>
				<role name="dmSuper"/>				
				<role name="cpSuper"/>
				<role name="ccbcMan"/>
				<role name="ccbcUser"/>
				<role name="ccbcSGB2"/>			
			</access>					
	</xsl:template>

</xsl:stylesheet>
