<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100A4"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="font-weight: bold; margin-bottom: 0.4cm; font-size: 12pt;">
			In Bankruptcy
		</div>
	
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtDate"/>
		</div>
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			On the hearing of an application by the Applicant for an order that the Statutory Demand issued on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDemandOrderDate"/> be set aside. 
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>
		</div>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			AND UPON READING THE EVIDENCE
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">IT IS ORDERED THAT </span> <xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdInjunctionOrderDetails"/>
		</div>
		<div style="margin-bottom: 0.8cm;">
			Dated  <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>