<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1002F"><div><font size="4" face="Arial">
		<div style="margin-bottom: 0.4cm;">Dear <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGreeting"/></div>
		<div style="margin-bottom: 1.5cm; font-size: 12pt; font-weight: bold; text-align: center;">Re: Case Number: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWarrantCaseNumber"/> 
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPartyForName"/> v <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPartyAgainstName"/> 
		</div>
		<div style="margin-bottom: 0.4cm; font-size: 12pt; font-weight: bold; text-align: left;">
			Warrant Number: <xsl:choose xmlns="http://eds.com/supsfo">
								<xsl:when test="string-length($vdWarrantLocalNumber) &gt; 0"><xsl:value-of select="$vdWarrantLocalNumber"/></xsl:when>
								<xsl:otherwise><xsl:value-of select="$vdWarrantNumber"/></xsl:otherwise>
							</xsl:choose>
		</div>		
		<div style="margin-bottom: 0.4cm;">
			<span class="SupsFoCursor" id="SupsFoCursor">Start adding text here.</span><br/>
		</div>
		<div style="margin-bottom: 1.5cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLetterEnding"/>,</div>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdName"/></div>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSection"/> Section</div>
		<div>Ext <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdExtension"/></div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>