<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1008C"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="font-weight: bold; margin-bottom: 0.4cm; font-size: 12pt;">
			In Bankruptcy
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/></span>
		</div>
		<div style="margin-bottom: 2.0cm;">
			<span style="font-weight: bold;">On <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtDate"/></span>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>	
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">In the Matter of The Insolvency Act 1986</span>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">It is ordered that </span> <xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdInjunctionOrderDetails"/>
		</div>
		<div>
			Dated  <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>
  		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>