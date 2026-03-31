<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10085"><div><font size="4" face="Times New Roman">
			<div style="margin-top: 0.4cm; margin-bottom: 0.4cm;">
				Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>.
			</div>
			<div style="margin-bottom: 0.4cm;">
				<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>.	
			</div>
			<div style="margin-bottom: 0.4cm;">
				<span style="font-weight: bold;">UPON</span> the application of the <xsl:call-template xmlns="http://eds.com/supsfo" name="formatTextAreaText"><xsl:with-param name="text"><xsl:copy-of select="$vdApplicationInstigator"/> <xsl:copy-of select="$vdInstigatorName"/></xsl:with-param></xsl:call-template>.
			</div>
			<div style="margin-bottom: 0.4cm;">
				<span style="font-weight: bold;">IT IS ORDERED THAT </span> service of the <xsl:call-template xmlns="http://eds.com/supsfo" name="formatTextAreaText"><xsl:with-param name="text"><xsl:copy-of select="$vdDocumentService"/></xsl:with-param></xsl:call-template> on the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPartyService"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPartyServiceName"/> be dispensed with.
			</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>