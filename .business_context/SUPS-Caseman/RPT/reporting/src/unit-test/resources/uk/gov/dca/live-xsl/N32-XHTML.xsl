<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100AE"><div><font size="2" face="Times New Roman">

		<div style="margin-bottom: 0.4cm;"/>
		<div style="font-size: 10pt; margin-bottom: 0.4cm;">Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/></div>
		<div style="font-size: 10pt;"><xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/></div>		
		<div style="margin-bottom: 0.4cm;"/>
	
			
		<div style="font-size: 10pt; margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">It is adjudged </span>that the claimant do recover against the defendant the following goods of the claimant wrongly kept by the defendant, namely:-   
				<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdGoodsDetained"/> of the value of £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGoodsDetainedValue"/>	
			<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdDamagesAmount) &gt; 0"> 
				and also the sum of £<xsl:value-of select="$vdDamagesAmount"/> for damages for the detention of the goods
			</xsl:if>	
			and also the sum of £<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdCost"/></xsl:with-param>
			</xsl:call-template> 
			for costs.
		</div>
	
		<div style="font-size: 10pt; margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">It is ordered</span> 
			<xsl:if xmlns="http://eds.com/supsfo" test="$vdReturnGoods = 'Y'">
				that the defendant do return the goods to the claimant by <xsl:value-of select="$vdGoodsReturnDate"/>
			</xsl:if>
			<xsl:if xmlns="http://eds.com/supsfo" test="$vdReturnGoods = 'N'">
				that the defendant do pay the sum of £<xsl:value-of select="$vdGoodsDetainedValue"/>
			</xsl:if>
		</div>
		
		<div style="font-size: 10pt; margin-bottom: 0.4cm;">
			And that the defendant do pay the sum of £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDamagesAmount"/> 
			<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdDamagesAmount) &gt; 0">
				damages
			</xsl:if>			
			 and the sum of £<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
					<xsl:with-param name="value"><xsl:value-of select="$vdCost"/></xsl:with-param>
			</xsl:call-template> 
			for costs to reach the claimant by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCostPaymentDate"/>
		</div>
			
		<div style="font-size: 10pt; text-align: right; padding-left: 1.0cm;">
			<span style="font-weight: bold;">Dated</span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>
		</div>
		
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>