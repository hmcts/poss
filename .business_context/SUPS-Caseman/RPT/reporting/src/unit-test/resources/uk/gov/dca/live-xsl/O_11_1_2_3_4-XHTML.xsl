<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10097"><div><font size="4" face="Times New Roman">

		<div style="margin-bottom: 0.8cm;"/>
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			Sitting in court on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtDate"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			In the matter of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/>
		</div>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			And in the matter of the Insolvency Act 1986
		</div>
		<div style="margin-bottom: 0.4cm;">
			Upon the Petition of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorName"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			Presented to the court on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPetitionDate2"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			And upon reading the evidence 
		</div>					
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdEventId='690'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				It is ordered that the petition be adjourned to <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPetitionAdjournedDate"/>
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPetitionAdjournedTime"/>
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				before a District Judge sitting in Open Court at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
			</div>
		</xsl:if>		
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdEventId='691'">
		<div xmlns="" style="margin-bottom: 0.4cm;">
			It is ordered that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCompanyName"/> be wound up by this Court under the provisions of the Insolvency Act 1986
		</div>
		</xsl:if>	
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdEventId='692'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				It is ordered that the Petition be <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPetitionAction"/>
			</div>
		</xsl:if>	
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdEventId='693'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				It is ordered that <xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdInjunctionOrderDetails"/>
			</div>
		</xsl:if>	
		<div style="margin-bottom: 0.4cm;">
			And it is ordered that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInsolvencyPetitionerWording"/>
		</div>
		<div>
			Dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>
  		</div>
 		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>