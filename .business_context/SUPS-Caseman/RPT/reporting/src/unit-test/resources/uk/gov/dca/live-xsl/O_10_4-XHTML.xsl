<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10091"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="font-weight: bold; margin-bottom: 0.4cm; font-size: 12pt;">
			In Bankruptcy
		</div>
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			Upon the application of
		</div>	
		<div style="margin-bottom: 0.4cm;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdInstigatorAddressMultiLine"/>
		</div>

		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>
		</div>

		<div style="margin-bottom: 0.4cm;">
			And upon reading the evidence 
		</div>

		<div style="margin-bottom: 0.4cm;">
			And the court having this day considered the report of the nominee submitted pursuant to section 256 of the Insolvency Act 1986 and filed on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdNomineeReportDate"/>
		</div>

		<div style="margin-bottom: 0.4cm;">
			It is ordered that the period for which the interim order made on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInterimOrderDate"/> has effect to be 
			extended to <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInterimOrderExtendedDate"/> to enable a meeting of the debtor's creditors 
			to be summoned to consider the debtor's proposals, such meeting as proposed by the nominee to be held on:
		</div>

		<div style="margin-bottom: 0.4cm;">
			Date: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdMeetingDate"/>  
 		</div>
		<div style="margin-bottom: 0.4cm;">			
			Time: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdMeetingTime"/>
 		</div>
 		
		<div style="margin-bottom: 0.4cm;">
			at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdMeetingAddress"/>
 		</div>

		<div style="margin-bottom: 0.4cm;">
			And it is ordered that this application be adjourned to:
		</div>
			
		<div style="margin-bottom: 0.4cm;">
			Date: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate1"/>  
 		</div>
		<div style="margin-bottom: 0.4cm;">			
			Time: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/>
 		</div>
 		
		<div style="margin-bottom: 0.4cm;">
			at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/>
 		</div>

		<div style="margin-bottom: 0.4cm;">
			for consideration of the report of the chairman of the creditors' meeting.
 		</div>

		<div style="margin-bottom: 0.4cm;">
			Dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
 		</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>