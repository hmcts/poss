<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100CC"><div><font size="2" face="Times New Roman">
		<div>
			On <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-top: 0.4cm;">
			sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
		</div>
		<div style="margin-top: 0.4cm;">
			considered the order made on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInjunctionDate"/>
		</div>
		<div style="margin-top: 0.4cm; margin-bottom: 0.4cm;">
			and heard evidence that the defendant had disobeyed the order. Details of the breach(es) of the order which are alleged by the claimant are set out <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBreachAttached"/>
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdBreachDetails) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdBreachDetails"/>
			</div>
		</xsl:if>
		<div>			
			<span style="font-weight: bold;">and the court orders</span> that
		</div>
		<div>			
			1. The defendant be remanded on bail <xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdBailConditions) &gt; 0"><xsl:value-of select="normalize-space($vdBailConditions)"/></xsl:if>.
		</div>
		<div style="margin-bottom: 0.4cm;">
			2. The defendant attend the court at the next hearing. The date, time and place of the next hearing are shown on the <span style="font-weight: bold;">Notice of hearing which is attached to this order</span>.
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdBailConditions) &gt; 0">
			<div xmlns="">
				<span style="font-weight: bold;">Bail conditions</span>
			</div>
			<div xmlns="">
				The defendant shall be released on bail
			</div>
			<xsl:if test="string-length($vdRecognizanceSum) &gt; 0">
				<div xmlns="">
					- <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdRecognizanceSum"/>
				</div>
			</xsl:if>
			<xsl:if test="string-length($vdSureties) &gt; 0">
				<div xmlns="">
					- <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSureties"/>
				</div>
			</xsl:if>
			<xsl:if test="string-length($vdBailConditions1) &gt; 0">
				<div xmlns="">
					- <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBailConditions1"/>
				</div>
				<div xmlns="" style="margin-left: 2cm;">
					<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBailConditions2"/>
				</div>
				<div xmlns="" style="margin-left: 2cm;">
					<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBailConditions3"/>
				</div>
			</xsl:if>
		</xsl:if>

		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>