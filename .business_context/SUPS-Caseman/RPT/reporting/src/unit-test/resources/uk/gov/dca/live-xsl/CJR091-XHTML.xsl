<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100CA"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">On</span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDate"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div>
			considered the application of the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorPartyNumber"/> <xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdInstigatorPartyRoleLower"/> ('the judgment creditor'),
		</div>
		<div style="margin-bottom: 0.4cm;">
			from which it appears:
		</div>
		<div style="margin-bottom: 0.4cm; margin-left: 0.5cm;">
			a) there is an amount owing by the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectPartyNumber"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectPartyRoleLower"/> ('the judgment debtor') under the judgment or order given on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInterimChargingOrderDate"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentOtherCourt1"/> and
		</div>
		<div style="margin-bottom: 0.4cm; margin-left: 0.5cm;">
			b) there is a debt due or accruing due by the third party to the judgment debtor
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">and the court orders</span> that
		</div>
		<div style="margin-bottom: 0.4cm;">
			1.  The application will be heard at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/> on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate1"/> at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/> when a judge will decide whether a final third party debt order should be made.
		</div>
		<div style="margin-bottom: 0.4cm;">
			2. Until that hearing the third party must not, unless the court orders otherwise, pay to the judgment debtor, or to any other person, any sum of money due or
			accruing due by the third party to the judgment debtor, except for any part of that sum which exceeds the total shown below.
		</div>
		<div style="margin-bottom: 0.4cm;">
			<table>
				<col width="132.29999999999998"/>
				<col width="434.7"/>
				<tbody>
					<tr>
					<td/>
					<td style="border-style: solid; border-width: 0.02cm; padding-right: 0.3cm; padding-left: 0.3cm; padding-top: 0.2cm; padding-bottom: 0.2cm;">	
						<div style="text-align: left; margin-bottom: 0.4cm;">
							<table>
								<col width="275.18399999999997"/>
								<col width="132.29999999999998"/>
								<tbody>
									<tr>
										<td style="padding-right: 0.1cm;">
											<div>
												Amount now owing under the judgment or order including any costs and interest
											</div>
										</td>
										<td>
											<div style="text-align: right;">
												£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
															<xsl:with-param name="value"><xsl:value-of select="$vdAmountOutstanding"/></xsl:with-param>
														</xsl:call-template>
											</div>
										</td>
									</tr>
									<tr>
										<td style="padding-right: 0.1cm; padding-left: 0.1cm;">
											<div>
												Court Fee
											</div>
										</td>
										<td>
											<div style="text-align: right;">
												£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation"><xsl:with-param name="value">
														<xsl:value-of select="$vdApplicationFee"/></xsl:with-param>
													  </xsl:call-template>
											</div>
										</td>
									</tr>
									<tr>
										<td style="padding-right: 0.1cm; padding-left: 0.1cm;">
											<div>
												Costs of this application which may be allowed to the judgment creditor
											</div>
										</td>
										<td>
											<div style="text-align: right;">
												£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation"><xsl:with-param name="value">
														<xsl:value-of select="$vdApplicationCosts"/></xsl:with-param>
													  </xsl:call-template>
											</div>
										</td>
									</tr>
									<tr>
										<td style="padding-right: 0.1cm; padding-left: 0.1cm;">
											<div style="font-weight: bold; text-align: right;">
												Total
											</div>
										</td>
										<td style="border-top-style: solid; border-top-width: 0.03cm; border-bottom-style: solid; border-bottom-width: 0.03cm;">
											<div style="text-align: right;">
												£<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdTotalOwing"/>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
					</div>
				</td>
				</tr>
			</tbody>
			</table>	
		</div>
		<div style="font-weight: bold;">
			This interim order does not authorise the third party to pay any money to the judgment creditor at this stage.
		</div>
		<div style="font-weight: bold; margin-top: 0.5cm;">
			Hardship
		</div>
		<div>
			If the third party is a bank or building society, and the judgment debtor or their family suffers
			hardships through not being able to meet ordinary living expenses as a result of not being able to
			withdraw money from the account, a court may make a hardship payment order allowing some money to
			be paid out. An application form (N244) can be obtained from any court office <span style="font-style: italic;"> (see overleaf for
			further details)</span>
		</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>