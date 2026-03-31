<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100A7"><div><font size="2" face="Times New Roman">
		<div style="font-weight: bold;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOHearingAttendees"/>
		</div>
		<div style="font-weight: bold;">
			IT IS ORDERED THAT
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdMoneyInCourt) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdMoneyInCourt"/>
			</div>
		</xsl:if>
		<div>
			the following debt be deleted from this Administration Order -
		</div>
		<div style="margin-bottom: 0.4cm;">
			<table>
				<col width="75.6"/>
				<col width="364.392"/>
				<col width="288.792"/>
				<tbody>
					<tr>
						<td/>
						<td>
							<div>
								Creditor
							</div>
						</td>
						<td>
							<div>
								Amount of Debt
							</div>
						</td>
					</tr>
					<tr>
						<td/>
						<td>
							<div>
								<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdRemovedDebtorName"/>
							</div>
						</td>
						<td>
							<div>
								£<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdRemovedDebtorAmount"/>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdCostsText) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdCostsText"/>
			</div>
		</xsl:if>
		<div style="text-align: right; margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">Dated </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">It is ordered </span>that the debtor pay into the court the debts listed in the schedule below <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCompType"/> by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstallmentPeriod"/>ly
			instalments of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOInstalmentAmount"/> until this order is satisfied, the first instalment to be paid by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderFirstPaymentDate"/>
		</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>