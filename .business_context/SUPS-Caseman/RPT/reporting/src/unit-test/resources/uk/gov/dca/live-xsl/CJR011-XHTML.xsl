<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100C0"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.4cm;"><span style="font-weight: bold;">The Defendant filed an Acknowledgement of Service on </span><span style="border-style: solid; border-width: 0.02cm; text-align: center; padding: 0.1cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdReceiptDate"/></span></div>
		<div style="margin-bottom: 0.4cm;">The defendant responded to the claim indicating an intention to <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDefendantIntention"/></div>
		<div style="margin-bottom: 0.4cm;">
			The defendant has 28 days from the date of service of the claim form with particulars of claim, or of the 
			particulars of claim, to file <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDefendantIntentionValue"/>
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdDefendantNameCorrected = 'Y'">
			<div xmlns="" style="margin-bottom: 0.4cm;">The defendant's name has been corrected to read <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdNewDefendantName"/></div>
		</xsl:if>
		<div style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdServiceAddressGivenValue"/></div>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdServiceName"/></div>
		<xsl:call-template xmlns="http://eds.com/supsfo" name="format-address-multi-line">
			<xsl:with-param name="party">
				<xsl:copy-of select="$vdServiceAddress"/>
			</xsl:with-param>
		</xsl:call-template>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdServiceAddressDX"/></div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>