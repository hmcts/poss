<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1008A"><div><font size="4" face="Times New Roman">
		<div style="margin-top: 0.8cm; margin-bottom: 0.4cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;"><xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/></div>
		<div style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFailureWording"/></div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> has ordered that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstructionsLQ"/><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstructionsHearing1"/>
		</div>
		<div style="margin-bottom: 0.4cm;">Dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$datetoday"/></div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>