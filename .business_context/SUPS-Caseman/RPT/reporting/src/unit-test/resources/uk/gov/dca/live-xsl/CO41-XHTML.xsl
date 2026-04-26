<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100B7"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOHearingAttendees"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			On the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDateN61A"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEmployerName"/> was ordered to give the court a statement of earnings relating to <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCODebtorName"/> in accordance with Section 14 of the Attachment of Earnings Act 1971 and has failed to do so.
		</div>
		<div style="margin-bottom: 0.4cm;">
			IT IS ORDERED that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEmployerName"/> do pay a fine of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFineAmount"/> for the offence and do pay that sum into the office of this court by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFineDate"/>.
		</div>
		<div style="text-align: right; margin-bottom: 1.2cm;">
			<span style="font-weight: bold;">Dated </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>