<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1007F"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.4cm;"/>
		<div style="margin-bottom: 0.4cm;">I hereby certify</div>
		<ol><xsl:call-template name="possession1"/></ol>
	
		<div style="margin-top: 0.4cm; margin-bottom: 0.4cm;">
			<table>
						<col width="378"/>
						<col width="76.73399999999998"/>
						<col width="189"/>
						<tbody>
							<tr>
								<td style="text-align: left;">
									<div style="margin-top: 0.2cm;">Signed_____________________________ </div>
								</td>
								<td style="text-align: right;">
									<div style="margin-top: 0.2cm;">Date </div>
								</td>
								<td>
									<div>________________________________  </div>
								</td>
							</tr>
						</tbody>
				</table>		
		</div>
		<div style="margin-bottom: 1.2cm;">
			Title_____________________________
		</div>
		<div>
			Produced for registration under Schedule 6 to the Civil Jurisdiction and Judgment Act 1982 by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSelectedJudgmentInFavourOfRole"/>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template><xsl:template name="possession1"><xsl:param name="number">1</xsl:param><li><div style="margin-bottom: 0.4cm;">
					<div>
					That the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSelectedJudgmentInFavourOfRole"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSelectedJudgmentInFavourOfName"/> of:
					</div>
					
					<div>
					<xsl:call-template xmlns="http://eds.com/supsfo" name="format-address-multi-line">
						<xsl:with-param name="party">
							<xsl:copy-of select="$vdSelectedJudgmentInFavourOfAddress"/>
						</xsl:with-param>
					</xsl:call-template>
					</div>
					
					<div> 
						obtained judgment against the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentAgainstRole"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentAgainstName"/> of:
					</div>
					
					<div> 
					<xsl:call-template xmlns="http://eds.com/supsfo" name="format-address-multi-line">
						<xsl:with-param name="party">
							<xsl:copy-of select="$vdJudgmentAgainstAddress1"/>
						</xsl:with-param>
					</xsl:call-template>
					</div>
					
					on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDateOut"/> in the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentCourtFullName"/> County Court for payment of the sum of 
					£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
						<xsl:with-param name="value">
							<xsl:value-of select="$vdAmount"/>
						</xsl:with-param>
					</xsl:call-template>
					in respect of <xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdClaimNature"/> together with 
					£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
						<xsl:with-param name="value">
							<xsl:value-of select="$vdCost"/>
						</xsl:with-param>
					</xsl:call-template>
					for costs, and that the sum of
					£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
						<xsl:with-param name="value">
							<xsl:value-of select="$vdRemainingAmount"/>
						</xsl:with-param>
					</xsl:call-template>
					remains unsatisfied.
				</div></li><xsl:call-template name="possession2"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:template><xsl:template name="possession2"><xsl:param name="number">1</xsl:param><xsl:choose><xsl:when test="string-length($vdInterestPercentage) &gt; 0"><li><div style="margin-bottom: 0.4cm;">That the judgment carries interest at the rate of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInterestPercentage"/>% per annum calculated on the judgment debt and costs from the date of judgment until payment.</div></li><xsl:call-template name="possession3"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:when><xsl:otherwise><xsl:call-template name="possession3"><xsl:with-param name="number"><xsl:value-of select="$number"/></xsl:with-param></xsl:call-template></xsl:otherwise></xsl:choose></xsl:template><xsl:template name="possession3"><xsl:param name="number">1</xsl:param><li><div style="margin-bottom: 0.4cm;">That the conditions specified in paragraph 3(a) and (b) of Schedule 6 to the Civil Jurisdiction and Judgments Act 1982 and Rule 74.17(2)(d) to (h) of the Civil Procedure Rules 1998 are satisfied in relation to the judgment.</div></li><xsl:call-template name="possession4"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:template><xsl:template name="possession4"><xsl:param name="number">1</xsl:param><li><div style="margin-bottom: 2.4cm;">This certificate is issued under Schedule 6 to the Civil Jurisdiction and Judgments Act 1982.</div></li></xsl:template></xsl:stylesheet>