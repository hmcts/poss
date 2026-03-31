<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10096"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.4cm; font-size: 12pt;">
			In Bankruptcy
		</div>
		<div style="margin-bottom: 0.4cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			Upon the application of
		</div>	
		<div style="margin-bottom: 0.4cm;">
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
				And upon the application of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdNomine"/> the nominee, for an extension of the period for which the interim order shall have effect pursuant to Section 256(4) of the Insolvency Act 1986.
			</div>
		</xsl:if>
		<div>
			It is ordered that during the period of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdExtensionPeriod"/> days beginning with the day after the date of this order and during any extended period for which this interim order has effect
		</div>
 	
		<div>
			(i)  no bankruptcy petition relating to the above-named <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/> (the debtor) may be presented or proceeded with and
 		</div>

		<div style="margin-bottom: 0.4cm;">
			(ii)  no other proceedings, and no execution or other legal process, may be commenced or continued against the debtor or his property except with the leave of the Court
		</div>

		<div style="margin-bottom: 0.4cm;">
			And it is ordered that the report of the nominee be submitted and delivered by him to the court not later than <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdReportDeliveredBy"/>
		</div>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdOrderS255) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				And it is ordered that <xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdOrderS255"/>
			</div>
		</xsl:if>

		<div style="margin-bottom: 0.4cm;">
			And it is ordered that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInterimOrderReasons"/>
		</div>
			
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdServedOnOR = 'Y'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				And it is ordered that the applicant forthwith serve a copy of this order on the official receiver
			</div>
		</xsl:if>
		 	
		<div style="margin-bottom: 0.4cm;">
			Date: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate1"/>
 		</div>
		<div style="margin-bottom: 0.4cm;"> 		
			Time: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/>
 		</div>
			
		<div style="margin-bottom: 0.4cm;">
			at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
 		</div>

		<div style="margin-bottom: 0.4cm;">
			be appointed for consideration of the nominee's report
 		</div>

		<div style="margin-bottom: 0.2cm;">
			Dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$datetoday"/>
 		</div>
 		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>