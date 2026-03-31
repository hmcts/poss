<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1008C"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="font-weight: bold; margin-bottom: 0.4cm; font-size: 12pt;">
			In Bankruptcy
		</div>
		<div style="margin-bottom: 0.4cm;">
			A bankruptcy order having been made by this court against
		</div>
		<div style="margin-left: 1cm; margin-bottom: 0.4cm; font-weight: bold;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdSubjectAddressMultiLine"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBankruptcyDate"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">It is certified that the said </span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">was discharged from his/her Bankruptcy </span> on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBankruptcyDischargeDate"/>
		</div>
		<div style="margin-bottom: 0.8cm;">
			Dated  <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
		</div>
		<footnote xmlns="http://eds.com/supsfo" noteextent="2.5"> 				
			<div xmlns="" style="margin-bottom: 0.4cm; text-decoration: underline;">
				Notice to Bankrupt
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				Should you, the bankrupt, require advertisement of this order in a local newspaper and/or the Gazette, you should, notify the Secretary of State enclosing the prescribed fee details of which can be obtained by contacting the official receiver
			</div>
		</footnote>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>