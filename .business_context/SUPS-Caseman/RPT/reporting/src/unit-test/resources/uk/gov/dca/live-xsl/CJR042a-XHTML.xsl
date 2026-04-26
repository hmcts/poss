<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100C9"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.2cm; font-weight: bold;">
			To the Defendant
		</div>
		<div>The claimant has objected to the rate of payment you offered.</div>
		<div>The court has therefore decided the rate at which you should pay. You must pay the claimant 
		£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
			<xsl:with-param name="value"><xsl:value-of select="$vdAmount"/></xsl:with-param>
		</xsl:call-template>
		for debt (and </div>
		<div>interest to date of judgment) and 
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
		
		<div>
		<table>
			<col width="289.548"/>
			<col width="138.34799999999998"/>
			<col width="7.56"/>
			<col width="213.94799999999998"/>
			<tbody>
				<tr>
					<td>
						<div>You must pay the claimant the total of</div>
					</td>
					<td style="border: 0.05cm solid;">
						<div>
							<xsl:choose xmlns="http://eds.com/supsfo">
								<xsl:when test="string-length($vdPaidBeforeJudgment) &gt; 0">
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
						<div>
							<xsl:choose xmlns="http://eds.com/supsfo">
								<xsl:when test="$vdJudgmentForthwith = 'N'">
									<xsl:choose>
										<xsl:when test="$vdPaymentInFullDate != $emptyDate">
											by <xsl:value-of select="$vdPaymentInFullDate"/>
										</xsl:when>
									</xsl:choose>				
								</xsl:when>
								<xsl:otherwise>
									forthwith
								</xsl:otherwise>
							</xsl:choose>				
						</div>		
					
					</td>
				</tr>
			</tbody>
		</table>
		</div>
		
		
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdInstalmentAmount) &gt; 0 and $vdInstalmentAmount !=0">
		
		<div xmlns="">
		<table>
			<col width="289.548"/>
			<col width="138.34799999999998"/>
			<col width="7.56"/>			
			<col width="213.94799999999998"/>
			<tbody>
				<tr>
					<td>
						<div>					
							<xsl:choose xmlns="http://eds.com/supsfo">
								<xsl:when test="string-length($vdInstalmentAmount) &gt; 0">
									<div xmlns="">by instalments of</div>
								</xsl:when>
								<xsl:otherwise/>
							</xsl:choose>	
						</div>
					</td>
					<td style="border: 0.02cm solid;">
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
			</tbody>
		</table>	
		</div>
		
		<div xmlns="">
		<table>
			<col width="289.548"/>
			<col width="138.34799999999998"/>
			<col width="7.56"/>
			<col width="213.94799999999998"/>
			<tbody>
				<tr>
					<td>
						<div>
							<xsl:choose xmlns="http://eds.com/supsfo">
								<xsl:when test="string-length($vdInstalmentAmount) &gt; 0">
									<div xmlns="">the first payment to reach the claimant by</div>
								</xsl:when>
								<xsl:otherwise>
									<div xmlns=""/>
								</xsl:otherwise>
							</xsl:choose>
						</div>
					</td>
									
						<td style="border: 0.02cm solid;">
							<div>
								<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFirstPaymentDate"/>
							</div>
						</td>
						<td/>
					<td>					
						<div>and on or before this date each <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstalmentPeriodValue"/> until the debt has been paid</div>
					</td>
				</tr>
			</tbody>
		</table>	
		</div>
		</xsl:if>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>