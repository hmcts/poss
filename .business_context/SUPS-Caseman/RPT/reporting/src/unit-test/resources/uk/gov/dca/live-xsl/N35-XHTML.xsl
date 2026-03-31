<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100B1"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 1.0cm;"/>
		
		<div style="margin-bottom: 0.6cm;">The judgment made against the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectPartyCode"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentCourtName"/>
		on the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDateOut"/> for payment of 
			£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdAmount - $vdPaidBeforeJudgment"/></xsl:with-param>
			</xsl:call-template>
			and
			£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdCost"/></xsl:with-param>
			</xsl:call-template>
			for costs is hereby varied.</div>
		<div style="margin-bottom: 0.6cm;"><span style="font-weight: bold;">It is now ordered</span> that the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectPartyCode"/> pay the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectPartyCodeOther"/> the outstanding sum<xsl:if xmlns="http://eds.com/supsfo" test="$vdInterestIncluded = 'Y'"> including any interest,</xsl:if> 
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdInterestIncluded = 'Y'">
			of
			£<xsl:call-template name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdInterestIncludedAmount"/></xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdJudgmentResult = 'GRANTED'">
			<xsl:value-of select="$vdPaymentFrequencyValue"/>
		</xsl:if>.</div>
		<div style="margin-bottom: 0.6cm; text-align: right;"><span style="font-weight: bold;">Dated </span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdVariationResultDate"/></div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>