<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10097"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="margin-bottom: 0.4cm; font-size: 12pt; font-weight: bold;">
			In Bankruptcy
		</div>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			Upon the application of:
		</div>
		<div style="margin-left: 1cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdApplicantNameQA"/>
		</div>		
		<div style="margin-left: 1cm;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdApplicantQAAddressMultiLine"/>
		</div>
		<div style="margin-left: 1cm; margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDescriptionOfApplicant"/>
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdHearingAttendees) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;"><xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/></div>
		</xsl:if>
		<div style="margin-bottom: 0.4cm;">
			And upon reading the evidence
		</div>
		<div>
			It is ordered that:
		</div>
		<div style="margin-bottom: 0.4cm; margin-left: 1cm;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdInsolvencyPractitionerMultiAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			having filed a statement that he is qualified to act as an insolvency practitioner in relation to the above-named bankrupt under the provisions of the Insolvency Act 1986 and that he consents so to act is appointed trustee of the above-named bankrupt's estate.
		</div>
		<div>
			Dated  <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>
  		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>