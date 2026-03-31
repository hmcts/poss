<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10085"><div><font size="4" face="Times New Roman">

		<div style="margin-bottom: 0.4cm;">
			The trial of the above <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdTrialNoticeRespect"/> will take place at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/>

		</div>
		<div style="margin-bottom: 0.4cm;">
			on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<table>
				<col width="75.6"/>
				<col width="642.5999999999999"/>
				<tbody>
					<tr>
						<td>
							<div>at</div>
						</td>
						<td style="border-top-style: solid; border-right-style: solid; border-left-style: solid; border-bottom-style: solid; border-top-width: 0.02cm; border-right-width: 0.02cm; border-left-width: 0.02cm; border-bottom-width: 0.02cm; padding-right: 0.2cm; padding-left: 0.2cm; padding-bottom: 0.2cm; padding-top: 0.2cm;">
								<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/></div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			Any application in the case must be made to the court where the case is to be tried.
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdJudge) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> has ordered that:
			</div>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdTimeAllowed) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				The time allowed for the trial is <xsl:value-of xmlns="http://eds.com/supsfo" select="normalize-space($vdTimeAllowed)"/>.
			</div>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdTimetable) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				<xsl:choose xmlns="http://eds.com/supsfo">
					<xsl:when test="$vdTimetable = 'AGPTS'">The timetable for the trial may be agreed by the parties, subject to the approval of the trial judge.</xsl:when>
					<xsl:when test="$vdTimetable = 'STA'">The timetable for the trial (subject to the approval of the trial judge) will be that:</xsl:when>
				</xsl:choose>
			</div>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdCrossExaminationTime) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				<xsl:value-of xmlns="http://eds.com/supsfo" select="normalize-space($vdCrossExaminationTime)"/>
			</div>
		</xsl:if>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdClaimantTime) &gt; 0">
			The time allowed for the claimant's evidence is <xsl:value-of select="$vdClaimantTime"/>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdDefendantTime) &gt; 0">
			The time allowed for the defendant's evidence is <xsl:value-of select="$vdDefendantTime"/>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSubmissionTime) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				The time allowed for submissions on behalf of each party is <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubmissionTime"/>
			</div>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdTimetable = 'STA'">
			<xsl:if test="string-length($vdRemainingTime) &gt; 0">
				<div xmlns="" style="margin-bottom: 0.4cm;">
					The remainder of the time allowed for the trial (being <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdRemainingTime"/>) is reserved for the judge to consider and give judgment and to deal with costs.
				</div>
			</xsl:if>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdClmShallLodge = 'Y'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				The claimant shall lodge at the court at least 7 days before the hearing an indexed bundle of documents contained in a ring binder and with each page clearly numbered.
			</div>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdCaseSummary = 'Y'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				A case summary (which should not exceed 250 words) outlining the matters still in issue, and referring where appropriate to the relevant documents shall be included in the bundle for the assistance of the judge in reading the papers before the trial.
			</div>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdAgreeBundle = 'Y'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				The parties shall seek to agree the contents of the trial bundle and the case summary.
			</div>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdInformCourt = 'Y'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				Each party must inform the court immediately if the claim is settled whether or not it is then possible to file a draft consent order to give effect to their agreement.
			</div>
		</xsl:if>
		<div style="margin-bottom: 0.8cm;">
			<span style="font-weight: bold;">Please note:</span> This case may be released to another Judge, possibly at a different Court.
		</div>
		<div style="margin-bottom: 0.8cm;">
			<span style="font-weight: bold;">Date: </span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$datetoday"/>
		</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>