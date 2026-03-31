<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100B2"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.4cm; font-size: 10pt;">Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/></div>
		<div style="margin-bottom: 0.4cm; font-size: 10pt;"><xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/></div>		
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdOrderMadeByConsent = 'true'">		
			<div xmlns="" style="margin-bottom: 0.4cm; font-size: 10pt;">By Consent </div>
		</xsl:if>		
		<div style="margin-bottom: 0.4cm; font-size: 10pt;">
			<span style="font-weight: bold;">It is adjudged </span>that, the defendant having failed to comply with the terms of a  
			<xsl:choose xmlns="http://eds.com/supsfo">
				<xsl:when test="$vdHirePurchaseAgreement = 'Y'">
					 regulated hire purchase agreement
				</xsl:when> 
				<xsl:otherwise>
					regulated conditional sale agreement
				</xsl:otherwise>
			</xsl:choose>
			dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAgreementDate"/> made between the claimant and the defendant <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDefendantSubjectName"/>, the claimant do 
			recover against the defendant <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDefendantSubjectName"/> the following goods of the claimant, being goods subject to the agreement and wrongfully 
			detained by the defendant, namely: <xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdGoodsDetained"/> and do recover against the defendant the sum of 
			£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdCost"/></xsl:with-param>
			</xsl:call-template>
			for costs. <span style="font-weight: bold;">It is ordered </span>that unless the defendant fulfil the conditions of the suspension, the defendant <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDefendantName"/> do return the goods to the 
			claimant by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGoodsReturnDate"/>
		</div>
		<div style="margin-bottom: 0.4cm; font-size: 10pt;">
			<span style="font-weight: bold;">And</span> that the operation of this order be suspended on condition that the unpaid balance of the hire-purchase price, namely
			£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdUnpaidAmount"/></xsl:with-param>
			</xsl:call-template>
			is paid to the claimant by instalments of 
			£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdInstalmentAmount"/></xsl:with-param>
			</xsl:call-template>
			for every calendar month, the first instalment to reach the claimant by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstalmentDate"/>
		</div>
		<div style="font-size: 10pt;">			
			<span style="font-weight: bold;">And</span> that the terms of the above-mentioned agreement be modified in the following respects:
		</div>
		<div style="margin-bottom: 0.4cm; font-size: 10pt;">
			no sum except the above-mentioned instalments shall be payable to the claimant in respect of the agreement during the suspension
		</div>
		<div style="margin-bottom: 0.4cm; font-size: 10pt;">
			<span style="font-weight: bold;">And</span> also that the defendant do pay the sum of 
			£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdCost"/></xsl:with-param>
			</xsl:call-template>
			for costs to the claimant by instalments of
			£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdInstalmentAmount"/></xsl:with-param>
			</xsl:call-template>
			for every calendar month, the first instalment to be paid one calendar month after the last instalment of the hire purchase price is paid.
		</div>
		<div>			
			<div style="font-size: 10pt; text-align: right; padding-left: 5.0cm;">
				<span style="font-weight: bold;">Dated</span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDateMade"/>
			</div>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>