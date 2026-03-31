<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10089"><div><font size="4" face="Times New Roman">
			<div style="font-weight: bold; margin-bottom: 0.4cm;">
				It is adjudged that
			</div>
			<div style="margin-bottom: 0.4cm;">
				the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorWording"/> recover against the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectWording"/> the sum of 								£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value">
					<xsl:value-of select="$vdAmount"/></xsl:with-param>
				</xsl:call-template>
				for debt and interest to date of judgment and 
				£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
					<xsl:with-param name="value"><xsl:value-of select="$vdCost"/></xsl:with-param>
				</xsl:call-template>
				 for costs amounting together to the sum of 
				£<xsl:choose xmlns="http://eds.com/supsfo">
					<xsl:when test="$vdTotal &gt; 0">
						<xsl:call-template name="correctCalculation">
							<xsl:with-param name="value">
								<xsl:value-of select="$vdTotal"/>
							</xsl:with-param>
						</xsl:call-template>.
					</xsl:when>
					<xsl:otherwise>0.00</xsl:otherwise>
				</xsl:choose>
			</div>
			<div style="margin-bottom: 0.4cm;">
				The <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectWording"/> having paid the sum of 
				£<xsl:choose xmlns="http://eds.com/supsfo">
					<xsl:when test="$vdTotal &gt; 0">
						<xsl:call-template name="correctCalculation">
							<xsl:with-param name="value">
								<xsl:value-of select="$vdPaidBeforeJudgment"/>
							</xsl:with-param>
						</xsl:call-template>.
					</xsl:when>
					<xsl:otherwise>0.00</xsl:otherwise>
				</xsl:choose>
			</div>
			<div style="margin-bottom: 0.2cm;">
				It is ordered that the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectWording"/> pay to the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorWording"/> the sum of 
				£<xsl:choose xmlns="http://eds.com/supsfo">
					<xsl:when test="$vdTotal - $vdPaidBeforeJudgment &gt; 0">
						<xsl:call-template name="correctCalculation">
							<xsl:with-param name="value">
								<xsl:value-of select="$vdTotal - $vdPaidBeforeJudgment"/>
							</xsl:with-param>
						</xsl:call-template>			
					</xsl:when>
					<xsl:otherwise>0.00</xsl:otherwise>
				</xsl:choose>										
				<xsl:choose xmlns="http://eds.com/supsfo">
					<xsl:when test="string-length($vdInstalmentAmount) &gt; 0">
						by instalments of
						£<xsl:call-template name="correctCalculation">
							<xsl:with-param name="value"><xsl:value-of select="$vdInstalmentAmount"/></xsl:with-param>
						</xsl:call-template>
						<xsl:value-of select="$vdPeriodWording"/>.
						The first payment to reach the <xsl:value-of select="$vdInstigatorWording"/> by
					</xsl:when>
					<xsl:otherwise>
						on or before
					</xsl:otherwise>
				</xsl:choose>
				<xsl:choose xmlns="http://eds.com/supsfo">
					<xsl:when test="$vdFirstPaymentDate != $emptyDate">
						<xsl:value-of select="$vdFirstPaymentDate"/>.
					</xsl:when>
					<xsl:when test="$vdPaymentInFullDate != $emptyDate">
						<xsl:value-of select="$vdPaymentInFullDate"/>.
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="$vdJudgmentDate"/>.
					</xsl:otherwise>
				</xsl:choose>
			</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>