<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100C0"><div><font size="2" face="Times New Roman">
		<div style="font-weight: bold; margin-bottom: 0.8cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.8cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOHearingAttendees"/>
		</div>
		<div style="margin-bottom: 0.8cm;">
			<span style="font-weight: bold;">IT IS ORDERED THAT </span>this application for a Consolidated Attachment of Earnings Order be listed for hearing
		</div>
		<div style="margin-bottom: 0.8cm;">
			at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.8cm;">
			on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate"/>
		</div>
		<div style="margin-bottom: 0.8cm;">
			at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/>
		</div>
		<div style="margin-bottom: 0.8cm; font-weight: bold;">
			If you do not attend the hearing, the court will make an order in your absence.
		</div>
		<div style="text-align: right;">
			<span style="font-weight: bold;">Dated </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>