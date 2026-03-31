<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10097"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="margin-bottom: 0.4cm; font-size: 12pt; font-weight: bold;">
			In Bankruptcy
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">Before </span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			Upon the hearing of this petition this day
		</div>
		<div style="margin-bottom: 0.4cm;">
			And upon the application of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorName"/>, a creditor of the debtor, for an order giving him carriage of the petition in place of the said <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOriginalPetitioner"/> (the petitioning creditor) pursuant to Rule 6.31 of the Insolvency Rules 1986
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdHearingAttendees) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.8cm;"><xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/></div>
		</xsl:if>
		<div style="margin-bottom: 0.4cm;">
			And upon reading the evidence 
		</div>
		<div style="margin-bottom: 0.4cm;">
			It is ordered that the carriage of this petition be given to the said <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorName"/> in place of the said <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOriginalPetitioner"/> and that all further proceedings herein be carried on by the said <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorName"/> in the name of the said <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOriginalPetitioner"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			And it is ordered that the said <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorName"/> do within <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDaysServedBy"/> days from the date of this order serve upon the said debtor and the said <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOriginalPetitioner"/> a sealed copy of this order
		</div>
		<div style="margin-bottom: 0.4cm;">
			And it is ordered that the said <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorName"/> may rely upon all evidence previously adduced in these proceedings whether by affidavit or otherwise
		</div>
		<div style="margin-bottom: 0.4cm;">
			And it is ordered that the further hearing of this petition be adjourned to:
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
		<div style="margin-bottom: 0.4cm;">
			And it is ordered that the question of the costs of the said <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOriginalPetitioner"/> be reserved until the final determination of this petition
 		</div>
		<div style="margin-bottom: 0.4cm;">
			Dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>
 		</div>
 	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>