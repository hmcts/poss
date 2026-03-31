<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10097"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOHearingAttendees"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			To <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCODebtorName"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCODebtorAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			YOU ARE SUMMONED to appear at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			on the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			to show cause why an order should not be made against you under Section 23(3) of the Attachment of Earnings Act 1971, for the payment of a fine not exceeding <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdMaxfine"/> or for your committal to prison for not more than 14 days for failing to comply with an attachment of earnings order made by this court
			on the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOOrderDate"/> in that you have failed <xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdDetailsOfOffence"/>
		</div>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			Important notes are set out overleaf
		</div>
		<div style="margin-bottom: 0.4cm; text-align: right;">
			<span style="font-weight: bold;">Dated </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>