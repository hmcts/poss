<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100A4"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOHearingAttendees"/>
		</div>
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			IT IS ORDERED THAT
		</div>
			<div style="margin-bottom: 0.4cm;">
				<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdCostsText) &gt; 0">
						1.
				</xsl:if>
				the application by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdRemovedDebtorName"/> of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCreditorAddress"/> to be added to this Administration Order be dismissed
			</div>
			<div style="margin-bottom: 0.4cm;">
				<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdCostsText) &gt; 0">
			
				2. <xsl:copy-of select="$vdCostsText"/>
		
				</xsl:if>
			</div>
		<div style="text-align: right;">
			<span style="font-weight: bold;">Dated </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>