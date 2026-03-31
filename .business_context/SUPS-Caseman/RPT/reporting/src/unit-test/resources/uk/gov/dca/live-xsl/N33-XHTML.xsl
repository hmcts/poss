<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100B2"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.4cm; font-size: 10pt;">Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/></div>
		<div style="margin-bottom: 0.4cm; font-size: 10pt;"><xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/></div>		
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdOrderMadeByConsent = 'true'">		
			<div xmlns="" style="margin-bottom: 0.4cm; font-size: 10pt;">By Consent </div>
			<div xmlns="" style="margin-bottom: 0.4cm;"/>
		</xsl:if>
			
		<div style="font-size: 10pt; margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">It is adjudged </span>that the claimant do recover against the defendant the following goods of the claimant wrongly detained by the defendant, namely   
				<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdGoodsDetained"/>
			of the value of £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGoodsDetainedValue"/>			
			and also the sum of £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionMortgage4"/> for arrears of hire-rent and the sum of £<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdCost"/></xsl:with-param>
			</xsl:call-template> 
			for costs.
		</div>
	
		<div style="font-size: 10pt; margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">It is ordered</span> that the defendant do return the goods to the claimant, or do pay the sum of £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGoodsDetainedValue"/> their value, to reach the claimant by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGoodsReturnDate"/>
		</div>
		
		<div style="font-size: 10pt; margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">And also </span> the defendant do pay the sum of £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionMortgage4"/> arrears and £<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdCost"/></xsl:with-param>
		</xsl:call-template> 
		
		for costs, amounting together to the sum of £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdTotalArrearsAndCost"/>, to the claimant 
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdInstalmentAmount &gt; 0">
			by instalments of £<xsl:value-of select="$vdInstalmentAmount"/> for every <xsl:value-of select="$vdInstalmentPeriodValue"/> the first instalment 
		</xsl:if>
		to reach the claimant by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFirstPaymentDate"/>
		</div>			
			
		<div style="font-size: 10pt; text-align: right; padding-left: 1.0cm;">
			<span style="font-weight: bold;">Dated: </span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>
		</div>
		
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>