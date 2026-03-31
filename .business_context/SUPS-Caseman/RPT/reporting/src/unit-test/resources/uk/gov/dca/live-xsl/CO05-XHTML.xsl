<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100B3"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.4cm;">
			<table>
				<col width="113.39999999999999"/>
				<col width="536.7599999999999"/>
				<tbody>
					<tr>
						<td>
							<div>
								To 
							</div>
						</td>
						<td>
							<div><table width="100%"><colgroup><col width="20" align="center" valign="top"/><col/></colgroup><tr><td style="width: 12;">•</td><td><div>the District Judge</div></td></tr><tr><td style="width: 12;">•</td><td><div>every constable within his jurisdiction</div></td></tr><tr><td style="width: 12;">•</td><td><div>the Governor of Her Majesty's Prison at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOPrisonName"/></div></td></tr></table></div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<table>
				<col width="189"/>
				<col width="536.7599999999999"/>
				<tbody>
					<tr>
						<td style="border-top-style: solid; border-left-style: solid; border-top-width: 0.02cm; border-left-width: 0.02cm;">
							<div>The Debtor</div>
						</td>
						<td style="border-top-style: solid; border-right-style: solid; border-top-width: 0.02cm; border-right-width: 0.02cm;">
							<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCODebtorName"/></div>
						</td>
					</tr>
					<tr>
						<td style="border-bottom-style: solid; border-left-style: solid; border-bottom-width: 0.02cm; border-left-width: 0.02cm;">
							<div>Of</div>
						</td>
						<td style="border-bottom-style: solid; border-right-style: solid; border-bottom-width: 0.02cm; border-right-width: 0.02cm;">
							<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCODebtorAddress"/></div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<table>
				<col width="189"/>
				<col width="536.7599999999999"/>
				<tbody>
					<tr>
						<td style="border-top-style: solid; border-left-style: solid; border-top-width: 0.02cm; border-left-width: 0.02cm;">
							<div>Employer<span style="font-style: italic;"> (if known)</span></div>
						</td>
						<td style="border-top-style: solid; border-right-style: solid; border-top-width: 0.02cm; border-right-width: 0.02cm;">
							<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEmployerName"/></div>
						</td>
					</tr>
					<tr>
						<td style="border-bottom-style: solid; border-left-style: solid; border-bottom-width: 0.02cm; border-left-width: 0.02cm;">
							<div>Of</div>
						</td>
						<td style="border-bottom-style: solid; border-right-style: solid; border-bottom-width: 0.02cm; border-right-width: 0.02cm;">
							<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEmployerAddress"/></div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOHearingAttendees"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDFLT1-2"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">IT IS ORDERED </span>that the Debtor be committed to prison for <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDisobedienceArrestCommittalDays"/> days.
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">You the District Judge, Bailiffs and others </span>are therefore required to arrest the Debtor and to deliver him to the prison and you the Governor to receive the Debtor and safely keep him in prison for <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDisobedienceArrestCommittalDays"/> days from the arrest under this order or until he shall be sooner discharged by due course of law.
		</div>
		<div style="margin-bottom: 0.4cm; text-align: right;">
			<span style="font-weight: bold;">Dated </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
		</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>