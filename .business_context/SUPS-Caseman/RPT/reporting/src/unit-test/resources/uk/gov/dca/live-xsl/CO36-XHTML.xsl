<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10097"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOHearingAttendees"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			To the Bailiffs of the court and every constable within the jurisdiction of the district judge
		</div>
		<div style="margin-bottom: 0.4cm;">
			The Debtor was ordered to attend on a specified day to give good reasons why <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOOrderHeShe"/> should not be fined or imprisoned for failure to provide a statement of means in accordance with section 14 of the Attachment of Earnings Act 1971 and the Debtor failed to attend the hearing
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">It is therefore ordered </span>that the Debtor be arrested and brought before this court forthwith
		</div>
		<div style="margin-bottom: 0.4cm;">
			You, the bailiffs and others are therefore required to arrest the Debtor and to bring <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOOrderHimHer"/> before this court
		</div>
		<div style="text-align: right; margin-bottom: 1.2cm;">
			<span style="font-weight: bold;">Dated </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
		</div>
		<div>
			<table>
				<col width="326.592"/>
				<col width="75.6"/>
				<col width="326.592"/>
				<tbody>
					<tr>
						<td style="padding-left: 0.2cm; padding-right: 0.2cm; border-style: solid; border-width: 0.02cm;">
							<div style="margin-bottom: 0.4cm; font-style: italic;">
								Description of Debtor
							</div>
							<div>
								<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdCODebtorDesc"/>
							</div>
						</td>
						<td/>
						<td style="padding-left: 0.2cm; padding-right: 0.2cm; border-style: solid; border-width: 0.02cm;">
							<div style="margin-bottom: 0.4cm; font-style: italic;">
								Debtor's place of employment
							</div>
							<div>
								<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEmployerName"/>
							</div>
							<div>
								<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdDebtorWorkAddress)&gt;0">
									<xsl:value-of select="$vdDebtorWorkAddress"/>
								</xsl:if>
								<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdDebtorWorkAddress)=0">
									<xsl:value-of select="$vdEmployerAddress"/>
								</xsl:if>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>