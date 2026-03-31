<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100CF"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="margin-bottom: 0.4cm;">
			On <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			considered the order made on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInjunctionDate"/>
		</div>
		<div style="margin-bottom: 0.8cm;">
			and heard evidence that the defendant had disobeyed the order. Details of the breach(es) of the order which are alleged by the claimant are set out <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBreachAttached"/>
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdBreachDetails) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdBreachDetails"/>
			</div>		
		</xsl:if>		
		<div style="margin-bottom: 0.4cm;">
			<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdHousing1) &gt; 0"><xsl:value-of select="$vdHousing1"/></xsl:if>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">and the court orders that</span>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">1.</span> The defendant be <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHousing2"/><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHousing3"/><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHospitalOrder2"/>.
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">2.</span> The defendant be produced before the court at the next hearing. <span style="font-weight: bold;">Notice of the next hearing is attached to this order.</span>
		</div>

		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>