<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100B0"><div><font size="2" face="Times New Roman">
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			This certificate is granted <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCertificatePurpose"/>
		</div>
		<div style="font-weight: bold;">
			Case Details	
		</div>
		<div style="margin-bottom: 0.4cm;">
			<table>
				<col width="415.79999999999995"/>
				<col width="302.4"/>
				<tbody>
					<tr>
						<td>
							<div>Date of issue of proceedings</div>
						</td>
						<td style="padding-top: 0.1cm; padding-bottom: 0.1cm; border-style: solid; border-width: 0.02cm;">
							<div style="margin-left: 0.3cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdProceedingsDate"/></div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<table>
				<col width="415.79999999999995"/>
				<col width="302.4"/>
				<tbody>
					<tr>
						<td>
							<div>Cause of action</div>
						</td>
						<td style="padding-top: 0.1cm; padding-bottom: 0.1cm; border-style: solid; border-width: 0.02cm;">
							<div style="margin-left: 0.3cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCauseOfAction"/></div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<table>
				<col width="415.79999999999995"/>
				<col width="302.4"/>
				<tbody>
					<tr>
						<td>
							<div>Date of judgment</div>
						</td>
						<td style="padding-top: 0.1cm; padding-bottom: 0.1cm; border-style: solid; border-width: 0.02cm;">
							<div style="margin-left: 0.3cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDateOut"/></div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div style="font-weight: bold;">
			Judgment details	
		</div>
		<div>
			Judgment entered against <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectPartyRole"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<table>
				<col width="321.29999999999995"/>
				<col width="245.7"/>
				<tbody>
					<tr>
						<td>
							<div>Amount of judgment</div>
						</td>
						<td style="text-align: right; border-style: solid; border-width: 0.02cm;">
							<div style="padding-top: 0.1cm; padding-bottom: 0.1cm; margin-right: 0.3cm;">£
								<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
									<xsl:with-param name="value"><xsl:value-of select="$vdAmount"/></xsl:with-param>
								</xsl:call-template>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div>
			<table>
				<col width="321.29999999999995"/>
				<col width="245.7"/>
				<tbody>
					<tr>
						<td>
							<div>Debt or claim</div>
						</td>
						<td style="padding: 0.1cm; text-align: right; border-top-style: solid; border-top-width: 0.02cm; border-right-width: 0.02cm; border-right-style: solid; border-left-width: 0.02cm; border-left-style: solid;">
							<div style="margin-right: 0.3cm;">£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
									<xsl:with-param name="value"><xsl:value-of select="$vdAmountOfDebt"/></xsl:with-param>
								</xsl:call-template>
								</div>
						</td>
					</tr>
					<tr>
						<td>
							<div>Costs</div>
						</td>
						<td style="padding: 0.1cm; text-align: right; border-right-style: solid; border-right-width: 0.02cm; border-left-style: solid; border-left-width: 0.02cm;">
							<div style="margin-right: 0.3cm;">£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
									<xsl:with-param name="value"><xsl:value-of select="$vdGoodsCostAmount"/></xsl:with-param>
								</xsl:call-template>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<div>Interest to date of judgment</div>
						</td>
						<td style="padding: 0.1cm; text-align: right; border-right-style: solid; border-right-width: 0.02cm; border-left-style: solid; border-left-width: 0.02cm;">
							<div style="margin-right: 0.3cm;">£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
									<xsl:with-param name="value"><xsl:value-of select="$vdInterestToJudgmentDate"/></xsl:with-param>
								</xsl:call-template>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<div>Subsequent costs</div>
						</td>
						<td style="padding: 0.1cm; text-align: right; border-right-style: solid; border-right-width: 0.02cm; border-left-style: solid; border-left-width: 0.02cm;">
							<div style="margin-right: 0.3cm;">£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
									<xsl:with-param name="value"><xsl:value-of select="$vdSubsequentCosts"/></xsl:with-param>
								</xsl:call-template>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<div>Interest from date of judgment*</div>
						</td>
						<td style="padding: 0.1cm; text-align: right; border-right-style: solid; border-right-width: 0.02cm; border-left-style: solid; border-left-width: 0.02cm;">
							<div style="margin-right: 0.3cm;">£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
									<xsl:with-param name="value"><xsl:value-of select="$vdInterestSinceJudgmentdate"/></xsl:with-param>
								</xsl:call-template>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<div>Total Amount</div>
						</td>
						<td style="padding: 0.1cm; text-align: right; border-style: solid; border-width: 0.02cm;">
							<div style="margin-right: 0.3cm;">£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
									<xsl:with-param name="value"><xsl:value-of select="$vdTotalAmountOwing"/></xsl:with-param>
								</xsl:call-template>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>