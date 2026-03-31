<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10030"><div><font size="4" face="Arial">
		<div style="margin-bottom: 0.4cm;">Dear <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGreeting"/></div>
		<div style="margin-bottom: 0.4cm; font-size: 12pt; font-weight: bold; text-align: center;">Re: Case Number: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimNumber"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimantName"/> v <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDefendant1Name"/>
		</div>
 		<xsl:if xmlns="http://eds.com/supsfo" test="$vdFeeRetained  = 'Y'">
			<div xmlns="" style="margin-bottom: 0.4cm; font-weight: bold;">
				Suspense Item : <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSuspenseItem"/>
			</div>
		</xsl:if>
		<div style="margin-bottom: 0.8cm;">
			Your
			<xsl:choose xmlns="http://eds.com/supsfo">
				<xsl:when test="$vdLetterRequestOth = 'L'">
					letter dated <xsl:value-of select="$vdLetterDate"/>
				</xsl:when>
				<xsl:when test="$vdLetterRequestOth = 'IR'">
					request for issue of <xsl:value-of select="$vdTypeOfProcess"/>
				</xsl:when>
				<xsl:when test="$vdLetterRequestOth = 'OTH'"><xsl:value-of select="$vdLetterRequestOthOther"/></xsl:when>
			</xsl:choose>
			has been referred to the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDistrictCircuitJudge"/> for directions. We will 
			notify you of the decision made in due course.
		</div>
 		<xsl:if xmlns="http://eds.com/supsfo" test="$vdFeeRetained  = 'Y'">
			<div xmlns="" style="margin-bottom: 0.8cm;">
				In the meantime your process will be retained and your fee entered into our suspense account.
				Should you need to contact the court please quote the above suspense item number on all communication.
			</div>
		</xsl:if>
		<div style="margin-bottom: 1.5cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLetterEnding"/></div>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdName"/></div>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSection"/> Section</div>
		<div>Ext <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdExtension"/></div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>