<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1008C"><div><font size="4" face="Times New Roman">
		<div style="margin-top: 1.0cm; margin-bottom: 0.8cm;">
			<span style="font-weight: bold;">To all parties</span>
		</div>
		<div style="margin-bottom: 0.4cm;">
			The procedural judge has identified this case as a claim which may be suitable for inclusion 
			in a specialist list. It has therefore been transferred to the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdTransferTo"/> where it will be referred 
			to <xsl:value-of xmlns="http://eds.com/supsfo" select="normalize-space($vdReferedTo)"/>. You will be sent <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdTransferSent"/> setting out the judge's directions. 
		</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>