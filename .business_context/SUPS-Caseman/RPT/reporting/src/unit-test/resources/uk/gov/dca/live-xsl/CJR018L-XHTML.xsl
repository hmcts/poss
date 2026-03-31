<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10088"><div><font size="4" face="Times New Roman">
		<div style="margin-top: 1.0cm; margin-bottom: 0.8cm;">
			<span style="font-weight: bold;">To all parties</span>
		</div>
		<div style="margin-bottom: 0.4cm;">
			This claim has been transferred to the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdTransferCourtNameDescription"/> for that court to deal with the claimant's application to lift the stay.
		</div>
		<div style="margin-bottom: 0.4cm;">
			That <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdTransferDistrictRegistry"/> will refer the application to a judge, or, if there is to be a hearing, will send you and the 
			other parties notice of the time, date and place of hearing.
		</div>
		<div style="margin-bottom: 0.4cm;">
			You will be sent a copy of the judge's decision.
		</div>
		<div style="margin-bottom: 0.2cm;">
			All further communication should be addressed to:
		</div>
		<div>
			The Court Manager
		</div>
		<div style="margin-bottom: 0.2cm;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdTransferCourtAddressMultiLine"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			Telephone: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdTransferCourtTelephoneNumber"/>
		</div>
		
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>