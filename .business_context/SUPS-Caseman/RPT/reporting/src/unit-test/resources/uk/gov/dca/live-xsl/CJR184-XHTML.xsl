<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1006D"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFeeFor"/>
		</div>
		<div>
			If by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFeePayDate"/> you have not paid the fee or applied for a fee remission, your <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFeeClaimCounterClaim"/> will be automatically struck out without further order of the court 
 			and you will be liable for the costs which the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPartyIncurringCosts"/> has incurred.
		</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>