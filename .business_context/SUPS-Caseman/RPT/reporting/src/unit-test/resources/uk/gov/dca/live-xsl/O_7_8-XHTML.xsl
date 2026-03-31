<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100AB"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.6cm;"/>
		<div>
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>.
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">It is adjudged</span> that the defendant having failed to comply with the terms of a 
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHPCSAgreement"/> dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAgreementDate"/> made between the claimant and the defendant <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDefendantSubjectName"/>,
			the claimant recovers against the defendant, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDefendantSubjectName"/>, the following goods of the claimant, being goods subject to the agreement and wrongfully kept by the defendant, 
			namely: <xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdGoodsDetained"/> and
			recovers against the defendant <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCostAssessed"/>.
		</div>
		<div>
        
			<span style="font-weight: bold;"> And It is ordered</span> that the defendant, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDefendantSubjectName"/>, do return the goods to the claimant by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGoodsReturnDate"/>.
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">And</span> that the defendant do pay 
			<xsl:choose xmlns="http://eds.com/supsfo">
				<xsl:when test="$vdIsCostAssesssed='Y'">
					<xsl:value-of select="$vdCostAssessed"/> 					
					<xsl:value-of select="$vdCostPaidPeriod"/>					
				</xsl:when>
				<xsl:otherwise>his costs to be assessed the amount of the cost when taxed with 14 days of taxation</xsl:otherwise>
			</xsl:choose>.    
		</div>
		<div style="text-align: right;">
			<span style="font-weight: bold;">Dated</span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>
		</div>

	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>