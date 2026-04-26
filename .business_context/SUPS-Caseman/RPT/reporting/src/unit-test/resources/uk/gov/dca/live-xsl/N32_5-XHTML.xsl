<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100B2"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 1.0cm;"/>
		<div style="margin-bottom: 0.8cm;">Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/></div>
		<div style="margin-bottom: 0.8cm;"><xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/></div>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdOrderMadeByConsent = 'Y'">
			<div xmlns="" style="font-size: 10pt; margin-bottom: 0.8cm;">By Consent </div>
		</xsl:if>
		<div style="margin-bottom: 0.8cm;">
			<span style="font-weight: bold;">It is ordered </span> that the order in this action dated  <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDateOfGoodsReturned"/> for the return of the specified goods be revoked and that the 
				defendant do pay the sum of 
			£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdBalanceofTotalPrice"/></xsl:with-param>
			</xsl:call-template>
			in respect of the balance of the total price of the goods and
			£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdCost"/></xsl:with-param>
			</xsl:call-template>
			for the costs to the claimant by instalments of 
			£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdInstalmentAmount"/></xsl:with-param>
			</xsl:call-template>
			for every calendar month, the first instalment to reach the claimant by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPaymentDate"/>
		</div>
		
		<div>			
			<div style="font-size: 10pt; margin-bottom: 0.8cm; text-align: right; padding-left: 5.0cm;">
				<span style="font-weight: bold;">Dated</span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDateMade"/>
			</div>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>