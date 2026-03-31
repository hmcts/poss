<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1007A"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.4cm; font-size: 12pt;">In Bankruptcy</div>
		<div>Let</div>
		<div style="margin-bottom: 0.4cm;"><xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdInstigatorAddressMultiLineNoDX"/></div>
		<div style="margin-bottom: 0.4cm;">attend before the District Judge as follows</div>
		<div style="margin-bottom: 0.4cm;">Date: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate"/>    Time: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/></div>
		<div style="margin-bottom: 0.4cm;">at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>.</div>
		<div style="margin-bottom: 0.4cm;">on the hearing of an application by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/> the applicant for an order that the statutory demand dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdStatutoryDemandDate"/> be set aside.</div>
		<div style="margin-bottom: 0.4cm;">The grounds on which the applicant claims to be entitled to the order are set out in the affidavit of the applicant sworn on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAffidavitSupportDate"/>, a copy of which accompanies this application.</div>
		<div>The names and addresses of the persons upon whom this application should be served are:</div>
		<div style="margin-bottom: 0.4cm;"><xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdInstigatorAddressMultiLineNoDX"/></div>
		<div>The applicant's address for service is:</div>
		<div><xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdSubjectAddressMultiLineNoDX"/></div>
		<div style="margin-bottom: 0.4cm; text-align: right;">Dated  <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdApplicationDate"/></div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>