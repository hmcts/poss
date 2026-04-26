<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10075"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 1.0cm;"/>
		<div style="margin-bottom: 0.7cm;">
			<span style="font-weight: bold;">On </span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtDate"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.7cm;">
			sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.7cm;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>
		</div>
		<div style="margin-bottom: 0.7cm;">
			<span style="font-weight: bold;">and the court orders</span> that
		</div>
		<div style="margin-bottom: 0.7cm;">
			1. The charge created by the order made on the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInterimDate"/> shall continue<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInterimMod"/>.
		</div>
		<div style="margin-bottom: 0.7cm;">
			2. The interest of the judgment debtor <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDebtorName"/> in the asset described in the schedule below stand charged with payment of the sum of 
			£<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAmountCharge"/> the amount now owing under a judgment or order given 
			on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInterimChargingOrderDate"/><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentOtherCourt"/> together with any further interest becoming due and 
			£<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGoodsCostAmount"/> the costs of the application.
		</div>
		<div style="margin-bottom: 0.7cm;">
			3. The costs are to be added to the judgment debt.
		</div>
		<div style="margin-bottom: 0.7cm; font-weight: bold; text-align: center;">
			The Schedule
		</div>	
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdIsLand = 'Y'">						
				<div xmlns="" style="margin-bottom: 0.7cm;">
					The address of the land or charged property is 
				<xsl:if xmlns="http://eds.com/supsfo" test="$vdIsLandAddress = 'Y'"> <xsl:value-of select="$vdSubjectAddress"/></xsl:if>
				<xsl:if xmlns="http://eds.com/supsfo" test="$vdIsLandAddress != 'Y'"> <xsl:value-of select="$vdAssetAddress"/></xsl:if>				
					 <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInterimCharging2"/>.
				</div>	
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdIsLand != 'Y'">						
			<div xmlns="" style="margin-bottom: 0.7cm; font-weight: bold; font-size: 14pt; text-align: center;">
				STOP NOTICE
			</div>
			<div xmlns="" style="margin-bottom: 0.7cm; font-weight: bold;">
				To <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHoldBody"/>
			</div>
			<div xmlns="" style="margin-bottom: 0.7cm;">
				Take notice that, in relation to the securities specified in the schedule to this order, you may not, without notice to <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorName"/> at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorAddress"/> register any transfer, or make any redemption payment, or, in the case of a unit trust, deal with the units, or, where dividends or interest are included in the order, pay any dividend or interest.
			</div>
		</xsl:if>
		
		<div style="margin-bottom: 0.8cm;">
			 <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInterimCharging3"/>
		</div>		
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>