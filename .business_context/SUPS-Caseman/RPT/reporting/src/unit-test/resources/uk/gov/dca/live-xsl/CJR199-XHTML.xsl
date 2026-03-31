<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10090"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 1cm;"/>
		<div style="font-weight: bold;">
			Expert Evidence
		</div>
		<div style="margin-bottom: 0.4cm;">
			The parties have permission to rely at the trial on the expert evidence as follows:
		</div>
		<table>

			<col width="170.1"/>
			<col width="151.2"/>
			<col width="426.38399999999996"/>
			<tbody>

				<tr>
					<td>
						<div>The Claimant:</div>
					</td>
					<td>
						<div>oral evidence:</div>
					</td>
					<td>
						<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimantOralBy"/></div>
					</td>
				</tr>

				<tr>
					<td/>
					<td>
						<div>written evidence:</div>
					</td>
					<td>
						<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimantWrittenBy"/></div>
					</td>
				</tr>

				<tr>
					<td>
						<div>The Defendant:</div>
					</td>
					<td>
						<div>oral evidence:</div>
					</td>
					<td>
						<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDefendantOralBy"/></div>
					</td>
				</tr>

				<tr>
					<td/>
					<td>
						<div>written evidence:</div>
					</td>
					<td>
						<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDefendantWrittenBy"/></div>
					</td>
				</tr>

			</tbody>

		</table>	

		<div style="margin-top: 0.8cm; font-weight: bold;">
			Trial Timetable
		</div>
		
		<xsl:choose xmlns="http://eds.com/supsfo">
			<xsl:when test="$vdTimetableAgreed = 'Y'">
				<div xmlns="">The timetable for the trial may be agreed by the parties, subject to the approval of the judge.</div>
			</xsl:when>
			<xsl:otherwise>The timetable for the trial (subject to approval of the judge) will be that
				<xsl:if test="string-length($vdClaimantTime) &gt; 0">
					<div xmlns="">The time allowed for the Claimant's evidence is <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimantTime"/></div>
				</xsl:if>
				<xsl:if test="string-length($vdDefendantTime) &gt; 0">
					<div xmlns="">The time allowed for the Defendant's evidence is <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDefendantTime"/></div>
				</xsl:if>
				<xsl:if test="string-length($vdSubmissionTime) &gt; 0">
					<div xmlns="">The time allowed for the submission on behalf of each party is <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubmissionTime"/></div>
				</xsl:if>
				<xsl:if test="string-length($vdRemainingTime) &gt; 0">
					<div xmlns="">The remainder of the time allowed for the trial (being <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdRemainingTime"/>) is reserved for the judge to consider and give the judgment and to deal with the costs.</div>
				</xsl:if>
			</xsl:otherwise>
		</xsl:choose>
		
		<div style="font-weight: bold; margin-top: 0.8cm;">
			Trial Bundle
		</div>
		<div>
			An indexed bundle of documents contained in a ring binder with each page clearly numbered shall be lodged at the court at least 7 days before the hearing.
		</div>
		
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdCaseSummary = 'Y'">
			<div xmlns="">A case summary of no more than 250 words, outlining the matters still in issue, and referring where appropriate to the relevant documents shall be included in the bundle for the assistance of the judge in reading the papers before the trial.</div>
		</xsl:if>
		
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdAgreeBundle = 'Y'">
			<div xmlns="">
				<xsl:choose xmlns="http://eds.com/supsfo">
					<xsl:when test="$vdCaseSummary = 'Y'">The parties shall seek to agree the contents of the bundle and the case summary.</xsl:when>
					<xsl:otherwise>The parties shall seek to agree the contents of the bundle.</xsl:otherwise>
				</xsl:choose>
			</div>
		</xsl:if>
		<div style="margin-bottom: 0.8cm;"/>
		<div style="text-align: right;">
			Dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>