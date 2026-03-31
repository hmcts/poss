<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1002E"><div><font size="4" face="Arial">
		<div style="margin-bottom: 0.4cm;">Dear <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGreeting"/></div>
		<div style="margin-bottom: 0.4cm; font-size: 12pt; font-weight: bold; text-align: center;">Re: Case Number: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWarrantCaseNumber"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPartyForName"/> v <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPartyAgainstName"/>
		</div>
		<div style="margin-bottom: 0.4cm; font-size: 12pt; font-weight: bold; text-align: left;">
			Warrant Number: <xsl:choose xmlns="http://eds.com/supsfo">
								<xsl:when test="string-length($vdWarrantLocalNumber) &gt; 0"><xsl:value-of select="$vdWarrantLocalNumber"/></xsl:when>
								<xsl:otherwise><xsl:value-of select="$vdWarrantNumber"/></xsl:otherwise>
							</xsl:choose>
		</div>
		<div style="margin-bottom: 0.4cm; text-align: center; font-weight: bold;">
			FINAL NOTICE
		</div>
		<div style="margin-bottom: 0.8cm;">
			This warrant has been issued for the payment of £<span class="SupsFoCursor" id="SupsFoCursor">Enter Oustanding Amount here.</span><br/> 				
			or the removal of your goods to the sale room. Unless within 24 hours the above amount is paid into the Court Office, you will leave me no alternative but to carry out the warrant by
			re-attending your premises with the auctioneers van and porters, to remove your goods to the sale room, to satisfy the warrant. You will have to pay additional removal and auctioneers costs. 
		</div>
		<div style="margin-bottom: 1.5cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLetterEnding"/></div>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBailiffName"/></div>
		<div>Bailiff</div>		
		<div>Telephone <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBailiffTelephone"/> between <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBailiffAvailability"/></div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>