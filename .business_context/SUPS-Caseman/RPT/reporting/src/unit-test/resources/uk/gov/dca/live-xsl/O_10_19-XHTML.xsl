<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1008C"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="font-weight: bold; margin-bottom: 0.4cm; font-size: 12pt;">
			In Bankruptcy
		</div>
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="font-weight: bold; margin-bottom: 2.0cm;">
			On <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDisobedienceHearingDate"/>
		</div>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			And In the Insolvencies Act 1986
		</div>
		<div style="font-weight: bold; margin-bottom: 0.4cm; font-size: 12pt;">
			In Bankruptcy
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">Upon</span> the application of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorName"/>
		</div>
		<div style="margin-bottom: 1.2cm;">
			<span style="font-weight: bold;">Presented</span> to the Court on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAppPresentedDate"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">And upon reading</span> the evidence
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">It is ordered</span> that <xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdInjunctionOrderDetails"/>
		</div>
		<div>
			Dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>