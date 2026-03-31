<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1008A"><div><font size="4" face="Times New Roman">
		<div style="margin-top: 0.4cm; margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> has considered the statements of case and allocation questionnaires filed and allocated the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAllocation"/> to the <span style="font-weight: bold;">small claims track</span>.
		</div>
		<div style="margin-bottom: 0.4cm;">
			Before the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAllocation"/> is listed for hearing, the judge has ordered that a preliminary hearing should take place :-	
		</div>
		<div style="margin-bottom: 0.4cm; margin-left: 1cm;">
				<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPreliminaryHearingReasonValue"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			The preliminary hearing will take place at <xsl:call-template xmlns="http://eds.com/supsfo" name="format-time"><xsl:with-param name="theTime"><xsl:value-of select="$vdHearingTime"/></xsl:with-param></xsl:call-template> on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate1"/> at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>,  <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>.
		</div>
		<div style="margin-bottom: 0.4cm;">
		<xsl:choose xmlns="http://eds.com/supsfo">
			<xsl:when test="string-length($vdAllocationReason) &gt; 0">
				<xsl:choose>
					<xsl:when test="$vdAllocationReasonGiven = 'Y'">
						The reasons the judge has given for allocation to this track are that  
					</xsl:when>
					<xsl:otherwise>
						The reason the judge has given for allocation to this track is that  
					</xsl:otherwise>
				</xsl:choose>
			<xsl:call-template name="formatTextAreaText">
					<xsl:with-param name="text"><xsl:copy-of select="$vdAllocationReason"/>
					</xsl:with-param></xsl:call-template>.
			</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>