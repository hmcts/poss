<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100C1"><div><font size="2" face="Times New Roman">
			<div style="margin-bottom: 0.8cm;">
				<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgementReason"/>t is ordered that the defendant must pay the claimant an amount which the court will decide, and costs. To prepare for hearing
			</div>
			<div style="margin-bottom: 0.8cm;">
				<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> orders that:	
			</div>
			<xsl:if xmlns="http://eds.com/supsfo" test="$vdHearingListed ='Y'">
				<div xmlns="" style="margin-bottom: 0.4cm;">
					You should attend the court at <xsl:call-template xmlns="http://eds.com/supsfo" name="format-time"><xsl:with-param name="theTime"><xsl:value-of select="$vdHearingTime"/></xsl:with-param></xsl:call-template> on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/> when the court will make its decision.
				</div>
			</xsl:if>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>