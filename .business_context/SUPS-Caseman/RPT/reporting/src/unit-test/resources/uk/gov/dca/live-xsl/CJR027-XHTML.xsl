<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10087"><div><font size="4" face="Times New Roman">
			<div style="margin-bottom: 2.0cm;"/>
			<div style="margin-top: 0.8cm; margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWordingRequired"/> 
				<xsl:call-template xmlns="http://eds.com/supsfo" name="formatTextAreaText">
					<xsl:with-param name="text"><xsl:copy-of select="$vdApplicationFor"/></xsl:with-param>
				</xsl:call-template> (see copy attached) will take place at 
			<xsl:call-template xmlns="http://eds.com/supsfo" name="format-time"><xsl:with-param name="theTime"><xsl:value-of select="$vdHearingTime"/></xsl:with-param></xsl:call-template> on the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate1"/> at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>,  <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>.</div>
			<div style="margin-bottom: 0.4cm; font-weight: bold;">Cases are listed in accordance with local hearing arrangements determined by the Judiciary and implemented by court staff. 
			Every effort is made to ensure that hearings start either at the time specified or as soon as possible thereafter. 
			However, listing practices or other factors may mean that delay is unavoidable.  
			Furthermore, in some instances a case may be released to another judge, possibly at a different court. 
			Please contact the court for further information on the listing arrangements that may apply to your hearing.
			</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>