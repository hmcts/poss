<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1007F"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOHearingAttendees"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">Take notice </span>that today the judge made a committal order for your imprisonment for <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOCommitalPeriod"/> days
		</div>
		<div style="margin-bottom: 0.4cm;">
			This order will not be put into force so long as you attend this court
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">on </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">at </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">at </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			You must also complete the enclosed form of reply and statement of means and send it to reach the court office within <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOResponseTime"/> days after you receive this order
		</div>
		<div style="text-align: right; margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">Dated </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>