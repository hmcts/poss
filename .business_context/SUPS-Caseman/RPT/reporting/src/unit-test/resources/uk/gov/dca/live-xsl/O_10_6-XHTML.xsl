<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10092"><div><font size="4" face="Times New Roman">
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
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>			
		</div>		
		<div style="margin-bottom: 0.4cm;">
			And upon reading the evidence 
		</div>
		<div style="margin-bottom: 0.4cm;">
			It is ordered that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPetitionInstructions"/>
		</div>

		<div style="margin-bottom: 0.4cm;">
			And it is ordered that the registration of the Petition as a pending action at the Land Charges Department of
			 HM Land Registry, on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdRegistrationDate"/> under Reference No. 
			 <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLRReference"/> be vacated upon the application of the Debtor under the Land
			  Charges Rules
 		</div>

		<div style="margin-bottom: 0.4cm;">
			Dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>
 		</div>
 	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>