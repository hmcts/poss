<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1009B"><div><font size="4" face="Times New Roman">
			<div style="margin-bottom: 0.8cm;"/>
			<div style="font-weight: bold; margin-bottom: 0.4cm; font-size: 12pt;">
				In Bankruptcy
			</div>
			<div style="margin-bottom: 0.4cm; font-weight: bold;">
				Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
			</div>
					
			<div style="margin-bottom: 0.4cm;">
				Upon the application of
			</div>
			<div style="margin-left: 1cm; margin-bottom: 0.4cm;">
				<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdInstigatorAddressMultiLine"/>
			</div>
			<div style="margin-left: 1cm; margin-bottom: 0.4cm;">
				<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDescriptionOfApplicant"/>
			</div>
			<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdHearingAttendees) &gt; 0">
				<div xmlns="" style="margin-bottom: 0.4cm;">
					<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>
				</div>
			</xsl:if>
			<div style="margin-bottom: 0.4cm;">
				And upon reading the evidence filed
			</div>
			<div style="margin-bottom: 0.4cm;">
				And it appearing that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBankruptcyOrder"/>
			</div>
			<div style="margin-bottom: 0.4cm;">
				It is ordered that the bankruptcy order dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBankruptcyDate"/> against <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/> is hereby annulled
			</div>
			<div style="margin-bottom: 0.4cm;">
				And it is ordered that the petition filed on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPetitionDate"/> be dismissed
			</div>
			<div style="margin-bottom: 0.4cm;">
				And it is ordered that the registration of the petition as a pending action at the Land Charges Department of HM Land Registry on 
				<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdRegistrationDate"/> under reference number <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLRReference"/>
				<xsl:if xmlns="http://eds.com/supsfo" test="($vdWritDate != $emptyDate)"> and of the bankruptcy order on the register of writs and orders affecting land at the department on <xsl:value-of select="$vdWritDate"/> under reference number <xsl:value-of select="$vdWritReference"/>
				</xsl:if> be vacated upon application made by the bankrupt.
			</div>
			<div style="margin-bottom: 0.4cm;">
				Dated  <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>
			</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>