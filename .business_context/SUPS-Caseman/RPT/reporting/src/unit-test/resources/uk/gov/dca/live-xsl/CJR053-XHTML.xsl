<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100D6"><div><font size="2" face="Times New Roman">
			<div style="font-weight: bold; margin-bottom: 0.4cm;"> ON THE 
				<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDate"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> </div>
			<div style="margin-bottom: 0.4cm;"> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/> </div>
			<div style="margin-bottom: 0.4cm;">
				<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>
			</div>
			<div style="margin-bottom: 0.4cm;"> <span style="font-weight: bold;">and 
				the court orders</span> that </div>
			<ol><xsl:call-template name="possession1"/></ol>
			<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdInitialPaymentRequired) &gt; 0">
				<div xmlns="" style="font-weight: bold;">Payments required</div>
				<div xmlns="">
					<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInitialPaymentRequired"/>
				</div>
				<xsl:if test="string-length($vdInstallmentPaymentRequired) &gt; 0">
					<div xmlns="">and <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstallmentPaymentRequired"/></div>
				</xsl:if>
			</xsl:if>
			<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdInstallmentPaymentRequired) &gt; 0 and string-length($vdInitialPaymentRequired) = 0">
				<div xmlns="">
					<span style="font-weight: bold;">Payments required</span>
				</div>
				<div xmlns="">
					<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstallmentPaymentRequired"/>
				</div>
			</xsl:if>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template><xsl:template name="possession1"><xsl:param name="number">1</xsl:param><li><div style="margin-bottom: 0.2cm;">The defendant give the 
						claimant possession of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionProperty"/> on or before 
						<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionDate"/>.</div></li><xsl:call-template name="possession2"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:template><xsl:template name="possession2"><xsl:param name="number">1</xsl:param><xsl:choose><xsl:when test="string-length($vdPossessionRent2) &gt; 0"><li><div style="margin-bottom: 0.2cm;">
						<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionRent2"/>
					</div></li><xsl:call-template name="possession3"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:when><xsl:otherwise><xsl:call-template name="possession3"><xsl:with-param name="number"><xsl:value-of select="$number"/></xsl:with-param></xsl:call-template></xsl:otherwise></xsl:choose></xsl:template><xsl:template name="possession3"><xsl:param name="number">1</xsl:param><xsl:choose><xsl:when test="string-length($vdPossessionRent3) &gt; 0"><li><div style="margin-bottom: 0.2cm;">
						<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionRent3"/>
					</div></li><xsl:call-template name="possession4"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:when><xsl:otherwise><xsl:call-template name="possession4"><xsl:with-param name="number"><xsl:value-of select="$number"/></xsl:with-param></xsl:call-template></xsl:otherwise></xsl:choose></xsl:template><xsl:template name="possession4"><xsl:param name="number">1</xsl:param><xsl:choose><xsl:when test="string-length($vdPossessionRent4) &gt; 0"><li><div style="margin-bottom: 0.2cm;">
						<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionRent4"/>
					</div></li><xsl:call-template name="possession5"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:when><xsl:otherwise><xsl:call-template name="possession5"><xsl:with-param name="number"><xsl:value-of select="$number"/></xsl:with-param></xsl:call-template></xsl:otherwise></xsl:choose></xsl:template><xsl:template name="possession5"><xsl:param name="number">1</xsl:param><xsl:choose><xsl:when test="string-length($vdPossessionRent5) &gt; 0"><li><div style="margin-bottom: 0.2cm;">
						<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionRent5"/>
						<span style="font-weight: bold;">
							<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionRent52"/>
						</span>
					</div></li></xsl:when><xsl:otherwise/></xsl:choose></xsl:template></xsl:stylesheet>