<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1008D"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.6cm;"/>
		<div style="margin-bottom: 0.8cm;">
			<span style="font-weight: bold;">On</span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInterimChargingOrderDate2"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> considered the application of the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentCreditor"/> ('the judgment creditor'), from which it appears:
		</div>
		<div style="margin-bottom: 0.8cm;">
			a) a judgment or order given on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInterimChargingOrderDate"/><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentOtherCourt"/> ordered the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDebtor"/> ('the judgment debtor') to pay money to the judgment creditor;
		</div>
		<div style="margin-bottom: 0.8cm;">
			b) the amount now owing under the judgment or order is £<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
			<xsl:with-param name="value"><xsl:value-of select="$vdAmountOutstanding"/></xsl:with-param>
		</xsl:call-template> (including any interest and costs); and
		</div>
		<div style="margin-bottom: 0.8cm;">
			c) the judgment debtor is the owner of, or has a beneficial interest in the asset described in the schedule below; 
		</div>
		<div>
			<span style="font-weight: bold;">and the court orders that</span>
		</div>
		<div style="margin-bottom: 0.8cm;">
			<span style="font-weight: bold;">1.</span> The interest of the judgment debtor <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/> in the asset described in the schedule below stand charged with payment of £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAmountOutstanding"/> together with any further interest becoming due and the costs of the application.
		</div>
		<div style="margin-bottom: 0.8cm;">
			<span style="font-weight: bold;">2.</span> The application will be heard at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/> on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate1"/> at  <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/> when a judge will decide whether the charge 
			created by this order should continue (with or without modification) or should be discharged.
		</div>
		<div style="margin-bottom: 0.8cm; text-align: center; font-weight: bold;">The Schedule</div>
		<div/>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdIsLand = 'Y'">
			<div xmlns="">
				The address of the land or property charged is
				<xsl:choose xmlns="http://eds.com/supsfo"> 
					<xsl:when test="$vdIsLandAddress = 'Y'"> <xsl:copy-of select="$vdSubjectAddress"/></xsl:when>
					<xsl:otherwise> <xsl:copy-of select="$vdAssetAddress"/></xsl:otherwise>
				</xsl:choose>
				 <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInterimCharging2"/>
			</div>
		</xsl:if>
		<div style="margin-bottom: 0.8cm;">
			 <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInterimCharging3"/>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>