<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100A2"><div><font size="2" face="Times New Roman">
		<div style="font-weight: bold;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOHearingAttendees"/>
		</div>
		<div>
			<span style="font-weight: bold;">An order </span>is made for the administration of the debtor's estate in the following terms:
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">It is ordered </span>that the debtor pay into the office of this court the debts listed in the schedule below <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCompType"/> by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOFrequency"/> 
			instalments of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOInstalmentAmount"/> until this order is satisfied, the first instalment is to be paid by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderFirstPaymentDate"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdReviewPeriod"/>
		</div>
		<div>
			<table>
				<col width="364.392"/>
				<col width="364.392"/>
				<tbody>
					<tr>
						<td>
							<div style="font-weight: bold;">
								Schedule of debts
							</div>
						</td>
						<td>
							<div style="text-align: right;">
								<span style="font-weight: bold;">Dated </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>