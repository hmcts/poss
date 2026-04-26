<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100BD"><div><font size="2" face="Times New Roman">
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div>
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOHearingAttendees"/>
		</div>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			IT IS ORDERED THAT
		</div>
		<div>
			<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdCostsText) &gt;0">a.</xsl:if> This Consolidated Attachment of Earnings Order be varied <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWhatVaried"/> the date of this order.
		</div>
			

		<div style="margin-bottom: 0.4cm;">
			<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdCostsText) &gt;0">b. <xsl:value-of select="$vdCostsText"/> </xsl:if> 
		</div>
		<div style="margin-bottom: 0.4cm;">
			<table>
				<col width="536.7599999999999"/>
				<col width="189"/>
				<tbody>
					<tr>
						<td>
							<div style="font-weight: bold;">
								To the Employer
							</div>
						</td>
						<td>
							<div style="text-align: right;">
								<span style="font-weight: bold;">Dated </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$datetoday"/>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div>
			<span style="font-weight: bold;">You are therefore ordered </span>to make deductions out of the earnings of the Debtor in accordance with the Attachment of Earnings Act 1971 until
			£<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOsNomicBalance1"/> the total amount payable under the judgments, together with any interest*, has been paid
		</div>
		<div style="margin-bottom: 0.4cm; font-style: italic;">* see over</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>