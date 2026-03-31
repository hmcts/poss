<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10090"><div><font size="4" face="Times New Roman">
		<div style="margin-top: 0.4cm; margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> has considered the statements of case and allocation questionnaires filed, and allocated the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAllocation"/> to <span style="font-weight: bold;">the fast track.</span></div>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsB1) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsB1"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsB2) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsB2"/></div></xsl:if>
	

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsC1) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsC1"/></div></xsl:if>

		<xsl:choose xmlns="http://eds.com/supsfo">
			<xsl:when test="string-length($vdFastTrackDirectionsE1) &gt; 0 or        string-length($vdFastTrackDirectionsF1) &gt; 0 or        string-length($vdFastTrackDirectionsG2) &gt; 0 or        string-length($vdFastTrackDirectionsG3) &gt; 0 or        string-length($vdFastTrackDirectionsG4) &gt; 0 or        string-length($vdFastTrackDirectionsG5) &gt; 0 or        string-length($vdFastTrackDirectionsG6) &gt; 0 or        string-length($vdFastTrackDirectionsG9) &gt; 0 or        string-length($vdFastTrackDirectionsG10) &gt; 0 or        string-length($vdFastTrackDirectionsH1) &gt; 0 or        string-length($vdFastTrackDirectionsH2) &gt; 0 or        string-length($vdFastTrackDirectionsI1) &gt; 0 or        string-length($vdFastTrackDirectionsI2) &gt; 0 or        string-length($vdFastTrackDirectionsI3) &gt; 0 or        string-length($vdFastTrackDirectionsI4) &gt; 0 or        string-length($vdFastTrackDirectionsI5) &gt; 0 or        string-length($vdFastTrackDirectionsI6) &gt; 0 or        string-length($vdFastTrackDirectionsI7) &gt; 0 or        string-length($vdFastTrackDirectionsI8) &gt; 0 or        string-length($vdFastTrackDirectionsI9) &gt; 0 or        string-length($vdFastTrackDirectionsI10) &gt; 0 or        string-length($vdFastTrackDirectionsI12) &gt; 0 or        string-length($vdFastTrackDirectionsI13) &gt; 0 or        string-length($vdFastTrackDirectionsI14) &gt; 0 or        string-length($vdFastTrackDirectionsI15) &gt; 0 or        string-length($vdFastTrackDirectionsI16) &gt; 0 or        string-length($vdFastTrackDirectionsJ1) &gt; 0 or        string-length($vdFastTrackDirectionsJ2) &gt; 0 or        string-length($vdFastTrackDirectionsK1) &gt; 0 or        string-length($vdFastTrackDirectionsK2) &gt; 0 or        string-length($vdFastTrackDirectionsL1) &gt; 0 or        string-length($vdFastTrackDirectionsM1) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsD1"/></div></xsl:when>
		</xsl:choose>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsE1) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:call-template xmlns="http://eds.com/supsfo" name="formatTextAreaText"><xsl:with-param name="text"><xsl:copy-of select="$vdFastTrackDirectionsE1"/></xsl:with-param></xsl:call-template></div></xsl:if>
		
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsF1) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsF1"/></div></xsl:if>
	
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsG2) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsG2"/><xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsG3) &gt; 0"> <xsl:value-of select="$vdFastTrackDirectionsG3"/></xsl:if><xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsG3) = 0">.</xsl:if></div></xsl:if>
	
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsG4) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsG4"/></div></xsl:if>
		
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsG5) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsG5"/></div></xsl:if>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsG6) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsG6"/></div></xsl:if>
	
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsG9) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsG9"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsG10) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsG10"/></div></xsl:if>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsH1) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsH1"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsH2) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsH2"/></div></xsl:if>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsI1) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsI1"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsI2) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsI2"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsI3) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsI3"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsI4) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsI4"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsI5) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsI5"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsI6) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsI6"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsI7) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsI7"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsI8) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsI8"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsI9) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsI9"/></div></xsl:if>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsI10) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsI10"/></div></xsl:if>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsI12) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsI12"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsI13) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsI13"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsI14) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsI14"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsI15) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsI15"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsI16) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsI16"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsJ1) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsJ1"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsJ2) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsJ2"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsK1) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsK1"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsK2) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsK2"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsL1) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFastTrackDirectionsL1"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdFastTrackDirectionsM1) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				<xsl:choose xmlns="http://eds.com/supsfo">
					<xsl:when test="variabledata/claim/hearing/fasttrack/lqdirecmade = 'Y'"> 
						Each party must file a completed pre-trial checklist no later 
						than <xsl:call-template name="format-date-placeholder"> 
						<xsl:with-param name="date-xpath"> <xsl:value-of select="variabledata/claim/hearing/fasttrack/lqdirecfiledate"/> 
						</xsl:with-param></xsl:call-template> and <xsl:value-of select="$vdHearingWhoIsToPayLQ"/> must pay a fee of £<xsl:value-of select="$vdLQFee"/>.
						<div xmlns="">
							In addition a hearing fee of £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLQHearingFee"/> 
							must be paid by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingWhoIsToPay"/>.
						</div>
						<div xmlns="">
							If the court is notified in 
							writing that the hearing is no longer needed the hearing fee 
							will be refunded in full or in part in certain circumstances, 
							please refer to the leaflets explaining more about what happens 
							when your case is allocated to track.
						</div>
					</xsl:when>
					<xsl:otherwise> The judge considers that the claim can be listed 
						for trial without the need for a pre-trial checklist. 
					</xsl:otherwise>
				</xsl:choose>
			</div>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdAllocationReason) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;">
		<xsl:choose xmlns="http://eds.com/supsfo">
			<xsl:when test="variabledata/claim/hearing/fasttrack/judgemltpsng = 'S'">
					The reason the judge has given for allocation to track is that
					<xsl:call-template name="formatTextAreaText">
						<xsl:with-param name="text"><xsl:copy-of select="$vdAllocationReason"/></xsl:with-param>
					</xsl:call-template>
				</xsl:when>
			<xsl:when test="variabledata/claim/hearing/fasttrack/judgemltpsng = 'M'">
					The reasons the judge has given for allocation to track are that
					<xsl:call-template name="formatTextAreaText">
						<xsl:with-param name="text"><xsl:copy-of select="$vdAllocationReason"/></xsl:with-param>
					</xsl:call-template>
				</xsl:when>
		</xsl:choose>.</div>
		</xsl:if>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>