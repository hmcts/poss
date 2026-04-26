<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1008C"><div><font size="4" face="Times New Roman">
		<div style="margin-top: 1.0cm; margin-bottom: 0.8cm;">
			<span style="font-weight: bold;">To all parties</span>
		</div>
		<div style="margin-bottom: 0.4cm;">
			As a result of the order made on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdTransferOrderDate"/> this <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCaseProceeding"/> has been transferred to the 
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdTransferCourtNameDescription"/> for trial. If you wish to make any further applications in this claim,
			they should be made to the court to which the claim has been transferred. 
			<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdTransferReturnHomeCourt2) &gt; 0">
				<xsl:value-of select="$vdTransferReturnHomeCourt2"/>
			</xsl:if>
			
		</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>