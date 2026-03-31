<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1008C"><div><font size="4" face="Times New Roman">
		<div style="margin-top: 1.0cm; margin-bottom: 0.8cm;">
			<span style="font-weight: bold;">To all parties</span>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:choose xmlns="http://eds.com/supsfo">
				<xsl:when test="$vdCounterclaim = 'Y'">A Counterclaim </xsl:when>
				<xsl:otherwise>A defence </xsl:otherwise>
			</xsl:choose>
			to this claim has been filed. As the defendant is an individual the claim has been
			transferred to the court covering the area where the defendant lives or carries on business.
			Please read the accompanying documents carefully and note that where enclosed the allocation
			questionnaire should be returned to the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdTransferCourtNameDescriptionPrefix"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdTransferCourtAddress"/> by the date shown. 
		</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>