<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100D0"><div><font size="2" face="Times New Roman">
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			ON THE <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDate"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:call-template xmlns="http://eds.com/supsfo" name="format-address-single-line">
				<xsl:with-param name="theAddress">
					<xsl:copy-of select="$vdCourtAddress"/>
				</xsl:with-param>
			</xsl:call-template>
		</div>
		<div style="margin-bottom: 0.4cm;">
			read the written evidence of the claimant
			<xsl:if xmlns="http://eds.com/supsfo" test="$vdHasWrittenEvidence = 'Y'">
				and the defendant
			</xsl:if>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">and the court orders</span> that
		</div>

		<ol><xsl:call-template name="possession1"/></ol>
		<div>
			Note: This order was made without a hearing. Within 14 days of its being served, either party may apply for it to be set aside or varied.
		</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template><xsl:template name="possession1"><xsl:param name="number">1</xsl:param><li><div style="margin-bottom: 0.4cm;">
				The defendant give the claimant possession of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionProperty"/>
				</div><div style="margin-bottom: 0.4cm;">
				on or before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionDate"/>.
				</div></li><xsl:call-template name="possession2"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:template><xsl:template name="possession2"><xsl:param name="number">1</xsl:param><xsl:choose><xsl:when test="$vdHasCostOrder = 'Y' and string-length($vdCost) &gt; 0"><li><div style="margin-bottom: 0.4cm;">
								The defendant pay the claimant's costs of
								£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
												<xsl:with-param name="value">
													<xsl:value-of select="$vdCost"/>
												</xsl:with-param>
											</xsl:call-template>
											<xsl:choose xmlns="http://eds.com/supsfo">
												<xsl:when test="string-length($vdPaymentInFullDate) &gt; 0 and $vdPaymentInFullDate != $emptyDate">
													on or before <xsl:value-of select="$vdPaymentInFullDate"/>.
												</xsl:when>
												<xsl:otherwise>
												by instalments of 
												£<xsl:call-template name="correctCalculation">
														<xsl:with-param name="value">
															<xsl:value-of select="$vdInstalmentAmount"/>
														</xsl:with-param>
													</xsl:call-template>
												every <xsl:value-of select="$vdInstalmentPeriodValue"/> the first payment to be made on or before <xsl:value-of select="$vdFirstPaymentDate"/>.
												</xsl:otherwise>
											</xsl:choose>
							</div></li><xsl:call-template name="possession3"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:when><xsl:otherwise><xsl:call-template name="possession3"><xsl:with-param name="number"><xsl:value-of select="$number"/></xsl:with-param></xsl:call-template></xsl:otherwise></xsl:choose></xsl:template><xsl:template name="possession3"><xsl:param name="number">1</xsl:param><xsl:choose><xsl:when test="$vdHasPostponeRequest = 'Y'"><li><div style="margin-bottom: 0.4cm;">
							The date for possession may be varied when the judge considers the defendant's request to postpone it.
						</div></li></xsl:when><xsl:otherwise/></xsl:choose></xsl:template></xsl:stylesheet>