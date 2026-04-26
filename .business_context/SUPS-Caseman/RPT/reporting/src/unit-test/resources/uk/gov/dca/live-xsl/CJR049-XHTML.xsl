<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100CA"><div><font size="2" face="Times New Roman">	
		<div style="margin-bottom: 0.3cm; font-weight: bold;">
			To the Defendant
		</div>
		<div style="margin-bottom: 0.3cm;">The claimant obtained judgment against you on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDate"/> for an amount to be decided by the court.</div>
		<div style="margin-bottom: 0.3cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> has decided the amount and ordered that you should pay 
			£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdAmount"/></xsl:with-param>
			</xsl:call-template>
			 (including interest to date of judgment) and 
			£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdCost"/></xsl:with-param>
			</xsl:call-template>
			for costs
			<xsl:choose xmlns="http://eds.com/supsfo">
				<xsl:when test="string-length($vdPaidBeforeJudgment) &gt; 0 and $vdPaidBeforeJudgment != '0' and $vdPaidBeforeJudgment != '0.00'">
					(less 
					£<xsl:call-template name="correctCalculation">
						<xsl:with-param name="value"><xsl:value-of select="$vdPaidBeforeJudgment"/></xsl:with-param>
					</xsl:call-template>
					 which you have already paid).
				</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</div>
		<table>
			<col width="281.988"/>
			<col width="176.148"/>
			<col width="7.56"/>
			<col width="176.148"/>
			<tbody>
				<tr>
					<td>
						<div style="margin-bottom: 0.3cm;">You must pay the claimant the total of</div>
					</td>
					<td>
						<div style="border-style: solid; border-width: 0.02cm;">
							<xsl:choose xmlns="http://eds.com/supsfo">
								<xsl:when test="$vdPaidBeforeJudgment &gt; 0">
									£<xsl:call-template name="correctCalculation">
										<xsl:with-param name="value"><xsl:value-of select="$vdAmount + $vdCost - $vdPaidBeforeJudgment"/></xsl:with-param>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									£<xsl:call-template name="correctCalculation">
										<xsl:with-param name="value"><xsl:value-of select="$vdAmount + $vdCost"/></xsl:with-param>
									</xsl:call-template>
									
								</xsl:otherwise>
							</xsl:choose>
						</div>
					</td>
					<td/>
					<td>
						<div style="margin-bottom: 0.3cm;">
							<xsl:choose xmlns="http://eds.com/supsfo">
								<xsl:when test="$vdPaymentInFullDate != $emptyDate">
									<xsl:choose>
										<xsl:when test="$vdPaymentInFullDate != $emptyDate">
											by <xsl:value-of select="$vdPaymentInFullDate"/>
										</xsl:when>
									</xsl:choose>
								</xsl:when>
								<xsl:when test="string-length($vdInstalmentAmount) = 0">
									<div xmlns="">forthwith</div>
								</xsl:when>
								<xsl:when test="string-length($vdInstalmentAmount) &gt; 0">
									<div xmlns=""/>
								</xsl:when>
							</xsl:choose>
						</div>
					</td>
				</tr>
			</tbody>
		</table>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdInstalmentAmount) &gt; 0 and $vdInstalmentAmount !=0">

		<table xmlns="">
			<col width="281.988"/>
			<col width="176.148"/>
			<col width="7.56"/>
			<col width="176.148"/>
			<tbody>
				<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdInstalmentAmount) &gt; 0">
					<tr xmlns="">
						<td>
							<div style="margin-bottom: 0.3cm;">					
								<xsl:choose xmlns="http://eds.com/supsfo">
									<xsl:when test="string-length($vdInstalmentAmount) &gt; 0">
										by instalments of
									</xsl:when>
									<xsl:otherwise/>
								</xsl:choose>	
							</div>
						</td>
						<td style="border-top-style: solid; border-right-style: solid; border-left-style: solid; border-bottom-style: solid; border-top-width: 0.02cm; border-right-width: 0.02cm; border-left-width: 0.02cm; border-bottom-width: 0.02cm;">
							<div>
								£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
									<xsl:with-param name="value"><xsl:value-of select="$vdInstalmentAmount"/></xsl:with-param>
								</xsl:call-template>
							</div>
						</td>
						<td/>
						<td>
							<div> per <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstalmentPeriodValue"/></div>
						</td>
					</tr>
				</xsl:if>
				<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdInstalmentAmount) = 0">
					<tr xmlns="">
						<td><div/></td>
						<td><div/></td>
						<td><div/></td>
						<td><div/></td>
					</tr>
				</xsl:if>
			</tbody>
		</table>	
		<table xmlns="">
			<col width="281.988"/>
			<col width="176.148"/>
			<col width="7.56"/>
			<col width="176.148"/>
			<tbody>
				<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdInstalmentAmount) &gt; 0">
					<tr xmlns="">
						<td>
							<div style="margin-bottom: 0.3cm;">
								<xsl:choose xmlns="http://eds.com/supsfo">
									<xsl:when test="string-length($vdInstalmentAmount) &gt; 0">
										the first payment to reach the claimant by
									</xsl:when>
									<xsl:otherwise/>
								</xsl:choose>
							</div>
						</td>
						
						
						<td style="border-top-style: solid; border-right-style: solid; border-left-style: solid; border-bottom-style: solid; border-top-width: 0.02cm; border-right-width: 0.02cm; border-left-width: 0.02cm; border-bottom-width: 0.02cm;">
							<div>
								<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFirstPaymentDate"/>
							</div>
						</td>
						<td/>
						
						
						
						
						
						<td>
							<div>and on or before this date each <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstalmentPeriodValue"/> until the debt has been paid</div>
						</td>
					</tr>
				</xsl:if>
				<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdInstalmentAmount) = 0">
					<tr xmlns="">
						<td><div/></td>
						<td><div/></td>
						<td><div/></td>
						<td><div/></td>
					</tr>
				</xsl:if>
			</tbody>
		</table>	

		</xsl:if>

		<div style="margin-top: 0.4cm;">
			If costs are to be assessed, you will be told when those costs have to be paid after assessment has taken place.
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>