<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10085"><div><font size="4" face="Times New Roman">
			<div style="margin-bottom: 1.0cm;"/>
			<xsl:choose xmlns="http://eds.com/supsfo">
				<xsl:when test="string-length($vdJudgeTitle) &gt; 0">
					<div xmlns="" style="margin-bottom: 0.4cm;">
						Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>.
					</div>
					<div xmlns="" style="margin-bottom: 0.4cm;">
						<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>	
					</div>
				</xsl:when>
				<xsl:otherwise>
					<div xmlns="" style="margin-bottom: 0.4cm;">
						Before The Proper Officer sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>.
					</div>
					<div xmlns="" style="margin-bottom: 0.4cm;">
						<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>	
					</div>
				</xsl:otherwise>
			</xsl:choose>
			<div style="margin-bottom: 0.4cm;">
				<span style="font-weight: bold;">IT IS ORDERED THAT </span> 
			</div>
			<div style="margin-bottom: 0.4cm;">
				<span class="SupsFoCursor" id="SupsFoCursor">Start adding text here.</span><br/>
			</div>
			<div style="margin-bottom: 0.4cm;">
				Dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDate"/>
			</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>