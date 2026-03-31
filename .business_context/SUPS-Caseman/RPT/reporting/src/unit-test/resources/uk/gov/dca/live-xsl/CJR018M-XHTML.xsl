<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10081"><div><font size="4" face="Times New Roman">
			<div style="margin-top: 1.0cm; margin-bottom: 0.8cm;">
				<span style="font-weight: bold;">To all parties</span>
			</div>
			<div style="margin-bottom: 0.4cm;">
				This claim has been transferred to the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdTransferCourtNameDescription"/> following judgment being entered (Please allow 5 working days from receipt of this notice for the file to be received at the Court).  
				On receipt, the file will be referred to a judge to give case management directions. Details of the judge's decision will be sent to you.
			</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>