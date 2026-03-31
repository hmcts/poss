<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100B3"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>. 
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> <span style="font-weight: bold;">Has ordered </span>that judgment be entered for the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorPartyNumber"/> <xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdInstigatorPartyRoleLower"/> and that the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectPartyNumber"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectPartyRoleLower"/> do pay <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDefendantWording1"/>.
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> <span style="font-weight: bold;">Has ordered </span>that the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectPartyNumber"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectPartyRoleLower"/> pays to the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorPartyNumber"/> <xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdInstigatorPartyRoleLower"/> the said <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDefendantWording2"/>.
		</div>
		<div style="text-align: right;">
			<span style="font-weight: bold;">Dated </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDate"/>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>