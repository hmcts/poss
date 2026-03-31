<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1009B"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.4cm; font-size: 12pt; font-weight: bold;">
			In Bankruptcy
		</div>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div>
			Upon the application of
		</div>	
		<div style="margin-left: 2cm; margin-bottom: 0.4cm;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdInstigatorAddressMultiLine"/>
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdHearingAttendees) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;"><xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/></div>
		</xsl:if>
		<div style="margin-bottom: 0.4cm;">
			And upon reading the evidence 
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdNomine) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				And upon the application of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdNomine"/> the nominee, for an extension of the period for which the interim shall have effect pursuant to Section 256(4) of the Insolvency Act 1986.
			</div>
		</xsl:if>
		<div style="margin-bottom: 0.4cm;">
			It is ordered that during the period of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdExtensionPeriod"/> days beginning with the day after the date of this order and during any extended period for which this interim order has effect
		</div>
 	
		<div style="margin-bottom: 0.4cm;">
			(i)  no bankruptcy petition relating to the above-named <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/> (the debtor) may be presented or proceeded with and
 		</div>

		<div style="margin-bottom: 0.4cm;">
			(ii)   no other proceedings, and no execution or other legal process, may be commenced or continued against the debtor or his property except with the leave of the Court
		</div>

		<div style="margin-bottom: 0.4cm;">
			It is ordered that the period for which the interim order made today <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/> has effect be extended to <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDateOfExtension"/> to enable a meeting of the debtor's creditors to be summoned to consider the debtor's proposals, such meeting as proposed by the nominee to be held on:
		</div>
		 	
		<div style="margin-bottom: 0.4cm;">
			Date: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdMeetingDate"/>  Time: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdMeetingTime"/>  
 		</div>
		<div style="margin-bottom: 0.4cm;">
			at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdMeetingAddress"/>
 		</div>
		<div style="margin-bottom: 0.4cm;">
			And it is ordered that this application be adjourned to:
 		</div>
		<div style="margin-bottom: 0.4cm;">
			Date: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate1"/>  Time: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/>
 		</div>
		<div style="margin-bottom: 0.4cm;">
			at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
 		</div>
		<div style="margin-bottom: 0.4cm;">
			for consideration of the report of the chairman of the creditors' meeting
 		</div>
		<div style="margin-bottom: 0.2cm;">
			Dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$datetoday"/>
 		</div>
 		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>