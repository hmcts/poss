<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100DB"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 1.0cm;"/>
		<div style="margin-bottom: 0.8cm;">
			<span style="font-weight: bold;">To</span> the bailiffs of the court and every constable within the district of the court
		</div>
		<div>
			<span style="font-weight: bold;">On </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWarrantDate"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div>
			sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.8cm;">
			heard an application by the claimant, supported by evidence that the defendant had disobeyed the order made on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInjunctionDate"/>.
			A copy of that order is attached to this warrant. Details of the breach(es) of the order which are alleged by the claimant are set out <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWarrantArrestScheduledAttached"/>
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdBreachDetails) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.8cm;">
				<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdBreachDetails"/>
			</div>
		</xsl:if>
		<div style="margin-bottom: 0.8cm;">
			<span style="font-weight: bold;">The Judge ordered</span> that a warrant of arrest be issued <xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdWarrantArrestDetails) &gt; 0"><xsl:value-of select="$vdWarrantArrestDetails"/></xsl:if>.
		</div>
		<div>
			You the bailiffs and constables are therefore required to arrest the defendant <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectAddress"/>
		</div>
		<div style="margin-bottom: 0.8cm;">
			and to bring <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDebtorHimHer"/> before a judge <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWarrantArrestBringNow"/>
		</div>
		<div>
			Dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWarrantDate"/>
		</div>

		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>