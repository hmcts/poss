<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1009F"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="font-weight: bold; margin-bottom: 0.4cm; font-size: 12pt;">
			In Bankruptcy
		</div>
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div>
			Upon hearing the petition of
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdSubjectAddressMultiLine"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			the above named debtor, which was presented on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPetitionDate"/>
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdHearingAttendees) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;"><xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/></div>
		</xsl:if>
		<div>
			And upon reading the evidence 
		</div>
		<div>
			It is ordered that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorName"/>
		</div>
		<div style="margin-bottom: 1.0cm;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdInstigatorAddressMultiLine"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			a person who is qualified to act as an insolvency practitioner in relation to the above-named debtor, be appointed to prepare and submit a report to the court by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdReportDate"/> as to whether the above-named debtor is willing to make a proposal for a voluntary arrangement
 		</div>
		<div style="margin-bottom: 0.4cm;">
			And it is ordered that the court will consider the report on:
		</div>
		<div style="margin-bottom: 0.4cm;">
			Date: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate1"/>
 		</div>
		<div style="margin-bottom: 0.4cm;"> 		
			Time: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/>
 		</div>
		<div style="margin-bottom: 0.4cm;">
			at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
 		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdDebtorAttendance) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDebtorAttendance"/></div>
		</xsl:if>
		<div style="margin-bottom: 0.4cm;">
			Dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>
 		</div>
 	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>