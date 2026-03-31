<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1008A"><div><font size="4" face="Times New Roman">
		<div style="margin-top: 1.0cm; margin-bottom: 0.8cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> has considered the statements of case and <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCmfHrgAllPtc"/> submitted in this <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQASubmit"/>
			and has decided that a hearing is necessary before a final decision about <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingFor"/> can be made.
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingReasons"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> orders you to attend at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/> on the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate1"/> at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>. 
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:if xmlns="http://eds.com/supsfo" test="$vdInfoRequiredFrom != 'NONE'"> 
				<xsl:value-of select="$vdJudge"/> requires the
				<xsl:choose>
					<xsl:when test="$vdInfoRequiredFrom = 'CLM'">
						Claimant
					</xsl:when>
					<xsl:when test="$vdInfoRequiredFrom = 'DEF'">
						Defendant
					</xsl:when>
				</xsl:choose>
				to provide the following 
				<xsl:if test="$vdIsFurtherHearing = 'Y'">further</xsl:if>	
				information and send copies to the court and the other parties by <xsl:value-of select="$vdInfoFileDate"/>
			 	:- <xsl:value-of select="$vdInfoDetails"/>.</xsl:if>
				</div>
			</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>