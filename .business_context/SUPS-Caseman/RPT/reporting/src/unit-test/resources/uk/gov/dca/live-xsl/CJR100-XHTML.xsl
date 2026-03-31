<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100CD"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 1.0cm;"/>
		<div style="margin-bottom: 0.8cm;">
			On <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.8cm;">
			sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.8cm;">
			a) found, as recorded in an order of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBreachOrderDate"/>, that the defendant had disobeyed an injunction made under section
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGuardianshipSection"/> of the Housing Act 1996,
		</div>
		<div style="margin-bottom: 0.8cm;">
			b) <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEvidenceGiven"/> evidence of two medical practitioners <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdMedicalPractitioner1"/> and <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdMedicalPractitioner2"/> as required by the provisions of section 37 of the Mental Health
			Act 1983 that the defendant is suffering from <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDefendantDisability"/> within the meaning of that Act,
		</div>
		<div style="margin-bottom: 0.8cm;">
			c) found that all other conditions, which under section 37 of the Mental Health Act 1983 are required to be satisfied for the making of
			a guardianship order, are satisfied in respect of the defendant and
		</div>
		<div style="margin-bottom: 0.8cm;">
			d) was satisfied that the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDefendantReceivedBy"/> specified below is willing to receive the defendant into guardianship;
		</div>
		<div>
			<span style="font-weight: bold;">and the court orders that</span>
		</div>
		<div>
			The defendant <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/> of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectAddress"/> be placed under the guardianship of
			<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdGuardianship1) &gt; 0"><xsl:value-of select="$vdGuardianship1"/></xsl:if>
			the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCouncilName"/> Council (Social Services Department).
		</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>