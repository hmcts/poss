<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100D0"><div><font size="2" face="Times New Roman">
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			ON THE <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDate"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName "/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">and the court orders that</span>
		</div>
		
		<ol><xsl:call-template name="possesion1"/></ol>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template><xsl:template name="possesion1"><xsl:param name="number">1</xsl:param><li><div>					
				The defendant give the claimant possession of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionProperty"/> 
				</div><div style="margin-bottom: 0.4cm;"> on or before  <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionDate"/>.
				</div></li><xsl:call-template name="possesion2"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:template><xsl:template name="possesion2"><xsl:param name="number">1</xsl:param><xsl:choose><xsl:when test="string-length($vdPossessionForfeiture2) &gt; 0"><li><div style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionForfeiture2"/></div></li><xsl:call-template name="possesion3"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:when><xsl:otherwise><xsl:call-template name="possesion3"><xsl:with-param name="number"><xsl:value-of select="$number"/></xsl:with-param></xsl:call-template></xsl:otherwise></xsl:choose></xsl:template><xsl:template name="possesion3"><xsl:param name="number">1</xsl:param><xsl:choose><xsl:when test="string-length($vdPossessionForfeiture3) &gt; 0"><li><div style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionForfeiture3"/></div></li><xsl:call-template name="possesion4"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:when><xsl:otherwise><xsl:call-template name="possesion4"><xsl:with-param name="number"><xsl:value-of select="$number"/></xsl:with-param></xsl:call-template></xsl:otherwise></xsl:choose></xsl:template><xsl:template name="possesion4"><xsl:param name="number">1</xsl:param><xsl:choose><xsl:when test="string-length($vdPossessionForfeiture4) &gt; 0"><li><div style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPossessionForfeiture4"/></div></li><xsl:call-template name="possesion5"><xsl:with-param name="number"><xsl:value-of select="$number + 1"/></xsl:with-param></xsl:call-template></xsl:when><xsl:otherwise><xsl:call-template name="possesion5"><xsl:with-param name="number"><xsl:value-of select="$number"/></xsl:with-param></xsl:call-template></xsl:otherwise></xsl:choose></xsl:template><xsl:template name="possesion5"><xsl:param name="number">1</xsl:param><xsl:choose><xsl:when test="string-length($vdCeaseDate) &gt; 0"><li><div style="margin-bottom: 0.4cm;">
				If the defendant pays the claimant the sums mentioned above on or before
				  <xsl:call-template xmlns="http://eds.com/supsfo" name="format-date">
					<xsl:with-param name="date-string-dd-MMM-yyyy">
						<xsl:value-of select="$vdCeaseDate"/>
					</xsl:with-param>
				</xsl:call-template>
				this order <span style="font-weight: bold;">shall have no effect</span> and <span style="font-weight: bold;">the lease will continue</span>.
					</div></li></xsl:when><xsl:otherwise/></xsl:choose></xsl:template></xsl:stylesheet>