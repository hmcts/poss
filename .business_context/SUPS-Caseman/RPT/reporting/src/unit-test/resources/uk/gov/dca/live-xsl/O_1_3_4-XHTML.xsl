<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100CC"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			On the application of the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentPartyType"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:choose xmlns="http://eds.com/supsfo">
				<xsl:when test="$vdWarrantSuspended='Y'">
					<span xmlns="" style="font-weight: bold;">And the court</span> having considered the papers received from the 
					parties and being satisfied that the Judgment Debtor is unable to pay and discharge
					the sum payable by him in this action (or the instalments due under the judgment order in this action).
				</xsl:when>
				<xsl:otherwise>
					<span xmlns="" style="font-weight: bold;">And the court being satisfied</span> that the Judgment Debtor 
					is unable to pay and discharge the sum payable by him in this action (or the instalments due under 
					the judgment or order in this action).
				</xsl:otherwise>
			</xsl:choose>									
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">It is ordered that</span> the warrant of execution issued in this action be suspended
			for so long as the Judgment Debtor do pay the Judgment Creditor the outstanding sum of £<span class="SupsFoCursor" id="SupsFoCursor">Enter Oustanding Amount here.</span><br/>
			<xsl:choose xmlns="http://eds.com/supsfo">
			<xsl:when test="$vdInstalmentAmount &gt; 0">
				by instalments of £<xsl:value-of select="$vdInstalmentAmount"/> 
				<xsl:if test="$vdInstalmentPeriodValue = 'month'"> for every calendar month</xsl:if>
				<xsl:if test="$vdInstalmentPeriodValue = 'fortnight'"> every fortnight</xsl:if>
				<xsl:if test="$vdInstalmentPeriodValue = 'week'"> every week</xsl:if>, the first instalment to reach the Judgment Creditor by <xsl:value-of select="$vdPaymentDate"/>
				<xsl:if test="string-length($vdDayOfMonthDue) &gt; 0">
					and further payments to reach the Judgment Creditor by the <xsl:value-of select="$vdDayOfMonthDue"/> day of each month						
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				by <xsl:value-of select="$vdPaymentDate"/> 
			</xsl:otherwise>
			</xsl:choose>.
		</div>

		<div>
			<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdWarrantLocalNumber) &gt; 0 ">
				<xsl:choose>
					<xsl:when test="$vdWarrantSuspended='Y'">
						The warrant will be returned to the <xsl:value-of select="$vdWarrantIssueCourtName"/> County Court after 16 days. After that  date
						any further correspondence should be sent there, quoting the court case number.
					</xsl:when>
					<xsl:otherwise>
						The warrant has been returned to <xsl:value-of select="$vdWarrantIssueCourtName"/> County Court. Any further correspondence should
						be sent there, quoting the court case number.
					</xsl:otherwise>
				</xsl:choose>				
			</xsl:if>									
		</div>
		<div style="text-align: right;">Date <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/></div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>