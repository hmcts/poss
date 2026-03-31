<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10096"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="margin-bottom: 0.4cm; font-weight: bold; font-size: 12pt;">
			In Bankruptcy
		</div>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			In the matter of a Bankruptcy Petition filed on the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPetitionDate"/>
		</div>
		<div style="margin-bottom: 0.4cm;">		
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAdjournedHearing"/>	
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>	
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdSupportCreditorsDet"/>
		</div>						
		<div style="margin-bottom: 0.4cm;">
			And upon reading the evidence 
		</div>
		<div style="margin-bottom: 0.4cm;">
			It is ordered that the further hearing of this Petition be adjourned to:
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
			Dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>
 		</div>
 	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>