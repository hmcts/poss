<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100A9"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 2.0cm;"/>
		<xsl:choose xmlns="http://eds.com/supsfo">
			<xsl:when test="$vdReasonSetAside = 'J'">
				<div xmlns="" style="margin-bottom: 0.8cm;">
					Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
				</div>
				<xsl:if test="string-length($vdHearingAttendees) &gt; 0">
					<div xmlns="" style="margin-bottom: 0.8cm;"><xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/></div>
				</xsl:if>
				<div xmlns="" style="margin-bottom: 0.8cm; font-weight: bold;">
					IT IS ORDERED THAT
				</div>
				<div xmlns="" style="margin-bottom: 0.8cm;">
					the judgment against <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentAgainstName"/> dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentOrderDate"/> be and is hereby set aside.
				</div>
				<xsl:if test="string-length($vdAnythingFurther) &gt; 0">
					<div xmlns="" style="margin-bottom: 0.8cm;">
						<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdAnythingFurther"/>
					</div>
				</xsl:if>
				<div xmlns="" style="margin-bottom: 1.2cm;"/>
			</xsl:when>
			<xsl:when test="$vdReasonSetAside = 'D'">
				<div xmlns="" style="margin-bottom: 0.4cm; font-weight: bold;">
					BY THE COURT OF ITS OWN MOTION
				</div>
				<div xmlns="" style="margin-bottom: 0.8cm;">
					<span style="font-weight: bold;">UPON </span>the Defendant filing his defence on the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDateDefenceFiled"/>
				</div>
				<div xmlns="" style="margin-bottom: 0.8cm; font-weight: bold;">
					IT IS ORDERED THAT
				</div>
				<div xmlns="" style="margin-bottom: 2cm;">
					the judgment dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentOrderDate"/> be and is hereby set aside.
				</div>
			</xsl:when>
			<xsl:when test="$vdReasonSetAside = 'N'">
				<div xmlns="" style="margin-bottom: 0.8cm; font-weight: bold;">
					BY THE COURT OF ITS OWN MOTION
				</div>
				<div xmlns="" style="margin-bottom: 0.8cm;">
					<span style="font-weight: bold;">UPON </span>the non-service of the claim
				</div>
				<div xmlns="" style="margin-bottom: 0.8cm; font-weight: bold;">
					IT IS ORDERED THAT
				</div>
				<div xmlns="" style="margin-bottom: 2cm;">
					the judgment dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentOrderDate"/> be and is hereby set aside.
				</div>
			</xsl:when>
			<xsl:when test="$vdReasonSetAside = 'P'">
				<div xmlns="" style="margin-bottom: 0.8cm; font-weight: bold;">
					BY THE COURT OF ITS OWN MOTION
				</div>
				<div xmlns="" style="margin-bottom: 0.8cm; font-weight: bold;">
					IT IS ORDERED THAT
				</div>
				<div xmlns="" style="margin-bottom: 2cm;">
					the judgment dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentOrderDate"/> be and is hereby set aside.
				</div>
			</xsl:when>
		</xsl:choose>
		<div style="margin-bottom: 0.4cm; text-align: right;">
			<span style="font-weight: bold;">Date Order Made: </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>
		</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>