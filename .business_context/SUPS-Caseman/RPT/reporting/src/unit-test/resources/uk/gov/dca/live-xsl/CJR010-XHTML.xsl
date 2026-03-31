<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100BC"><div><font size="2" face="Times New Roman">
			<div>
				<span style="font-weight: bold;">Take Notice that the court has sent the  
				<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdProcessNotServed"/>
				</span>
				<xsl:text xmlns="http://eds.com/supsfo"> by post and the envelope has been returned to the court marked: "</xsl:text><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEnvelopeMark"/><xsl:text xmlns="http://eds.com/supsfo">".</xsl:text>
			</div>
			<div style="margin-bottom: 0.4cm;">
			The document is nevertheless served unless the address given on it is not the relevant address for purposes of rule 6.5 of the Civil Procedure Rules.
			Note: The Civil Procedure Rules may be found at www.justice.gov.uk			
			</div>
			
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>