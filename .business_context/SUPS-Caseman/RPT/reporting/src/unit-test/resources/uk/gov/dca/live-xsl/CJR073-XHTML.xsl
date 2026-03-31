<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10085"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="margin-bottom: 0.4cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at  <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			Upon reading the evidence of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWhoseEvidence"/> dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDateEvidence"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> ORDERED
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstructionsSubstituted1"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdServiceAddress3"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstructionsSubstituted3"/> shall be deemed to be good and sufficient service of the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstructionsSubstitutedDocument"/> on the defendant <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGoodServiceWording"/>.
		</div>
		<div>
			Dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdReceiptDate"/>
		</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>