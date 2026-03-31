<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10032"><div><font size="4" face="Arial">
			<div style="margin-bottom: 0.4cm;">Dear Sir/Madam</div>		
			<div style="font-weight: bold;">
				Re: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCODebtorName"/>
			</div>
			<div style="font-weight: bold; margin-bottom: 1.5cm;">
				AO/CAEO No: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCONumber"/>
			</div>
			<div style="margin-bottom: 0.4cm;">
				<span class="SupsFoCursor" id="SupsFoCursor">Start adding text here.</span><br/>
			</div>
			<div style="margin-bottom: 1.5cm;">Yours faithfully,</div>
			<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdName"/></div>
			<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSection"/> Section</div>
			<div>Ext <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdExtension"/></div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>