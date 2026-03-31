<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100D0"><div><font size="2" face="Times New Roman">
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			ON THE <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDate"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">and the court orders that</span>
		</div>
						
		<ol><xsl:call-template name="possessionmortgage1"/></ol>



		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdPossessionMortgageInitialPay) &gt; 0">
			<div xmlns="" style="font-weight: bold;">Payments required</div>
			<div xmlns=""><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionMortgageInitialPay"/></div>
			<xsl:if test="string-length($vdPossessionMortgageInstallment) &gt; 0">
				<div xmlns=""><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionMortgageInstallment"/></div>
			</xsl:if>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdPossessionMortgageInitialPay) = 0 and string-length($vdPossessionMortgageInstallment) &gt; 0">
			<div xmlns="" style="font-weight: bold;">Payments required</div>
			<div xmlns=""><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionMortgageInstallment"/></div>
		</xsl:if>
				
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template><xsl:template name="possessionmortgage1"><xsl:param name="number">1</xsl:param><li><div>
						The defendant give the claimant possession of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionProperty"/> 
					</div><div style="margin-bottom: 0.4cm;">
						on or before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionDate"/>.
					</div></li><xsl:call-template name="possessionmortgage2"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:template><xsl:template name="possessionmortgage2"><xsl:param name="number">1</xsl:param><xsl:choose><xsl:when test="string-length($vdPossessionMortgage2) &gt; 0"><li><div style="margin-bottom: 0.4cm;">		
							<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionMortgage2"/>
						</div></li><xsl:call-template name="possessionmortgage3"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:when><xsl:otherwise><xsl:call-template name="possessionmortgage3"><xsl:with-param name="number"><xsl:value-of select="$number"/></xsl:with-param></xsl:call-template></xsl:otherwise></xsl:choose></xsl:template><xsl:template name="possessionmortgage3"><xsl:param name="number">1</xsl:param><xsl:choose><xsl:when test="string-length($vdPossessionMortgage3) &gt; 0"><li><div style="margin-bottom: 0.4cm;">		
							<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionMortgage3"/>
						</div></li><xsl:call-template name="possessionmortgage4"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:when><xsl:otherwise><xsl:call-template name="possessionmortgage4"><xsl:with-param name="number"><xsl:value-of select="$number"/></xsl:with-param></xsl:call-template></xsl:otherwise></xsl:choose></xsl:template><xsl:template name="possessionmortgage4"><xsl:param name="number">1</xsl:param><xsl:choose><xsl:when test="string-length($vdPossessionMortgage4) &gt; 0"><li><div style="margin-bottom: 0.4cm;">		
							This order is not to be enforced so long as the defendant pays the claimant the unpaid instalments under the mortgage of £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionMortgage4"/> by the payments set out below <span style="font-weight: bold;">in addition</span> to the current instalments under the mortgage.
						</div></li></xsl:when><xsl:otherwise/></xsl:choose></xsl:template></xsl:stylesheet>