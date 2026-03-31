<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100B1"><div><font size="2" face="Times New Roman">
		<div style="font-size: 12pt;">
			<div style="margin-bottom: 0.8cm;"/>	
			<div style="margin-bottom: 0.6cm;">
				<span style="font-weight: bold;">TAKE NOTICE </span>that the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTypeR5"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingWordingR5"/>
			</div>
			<div style="margin-bottom: 0.6cm;">
				<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate"/> at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/>
			</div>
			<div style="margin-bottom: 0.6cm;">
				at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
			</div>
			<div style="margin-bottom: 0.6cm;">
				When you should attend
			</div>
			<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdHearingDurationWording) &gt; 0">
				<div xmlns="" style="margin-bottom: 0.6cm;">
					<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDurationWording"/><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTypeR5"/>
				</div>
			</xsl:if>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>