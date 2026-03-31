<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100B0"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 1.0cm;"/>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>. 
		</div>
		<div style="margin-bottom: 0.4cm;">
				<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdProvisionInjunction"/>
		</div>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			Power of Arrest
		</div>
		<div>
		And the judge finding:
		</div>
		<div style="margin-bottom: 0.4cm;">
			That the conditions in sections <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGuardianshipSection"/> of the Housing Act 1996 are satisfied,
		</div>
		<div>
		And the court being satisfied that:
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtSatisfied"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			A power of arrest is attached to this injunction whereby any constable may under the power given in section 155 of the Housing Act 1996, arrest without warrant the defendant if the constable has reasonable cause for the suspecting the defendant is in breach of this injunction.
		</div>
		<div style="font-weight: bold; margin-bottom: 2.0cm;">
			This power of arrest was ordered on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdArrestOrderDate"/> and expires on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdArrestOrderExpiryDate"/>.
		</div>
	    </font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>