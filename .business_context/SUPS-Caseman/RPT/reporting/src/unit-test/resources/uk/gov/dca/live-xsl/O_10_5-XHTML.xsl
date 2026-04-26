<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10091"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="margin-bottom: 0.4cm; font-weight: bold; font-size: 12pt;">
			In Bankruptcy
		</div>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			In the matter of a Bankruptcy Petition filed on  the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPetitionDate"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			Upon the application of
		</div>	
		<div style="margin-left: 1cm; margin-bottom: 0.4cm;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdInstigatorAddressMultiLine"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			And upon reading the Affidavit of
		</div>
		<div style="margin-left: 1cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAffidavitName"/>
		</div>
		<div style="margin-left: 1cm;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdAffidavitAddress"/>
		</div>
		<div style="margin-left: 1cm; margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAffidavitJob"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			It is ordered that the service of a sealed copy of the above-mentioned Petition together with a sealed copy of this order <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPrepaidPostType"/> addressed to
		</div>
		
		<div style="margin-left: 1cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdServiceAddressedTo"/>
		</div>
		<div style="margin-left: 1cm; margin-bottom: 0.4cm;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdServiceAddressMultiLine"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubstitutedServiceWording"/> 
		</div>
		<div>
			Dated  <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>
  		</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>