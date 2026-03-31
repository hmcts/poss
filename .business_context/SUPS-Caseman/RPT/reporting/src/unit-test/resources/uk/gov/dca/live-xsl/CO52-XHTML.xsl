<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100A6"><div><font size="2" face="Times New Roman">

		<div style="font-weight: bold; margin-top: 0.6cm; margin-bottom: 0.4cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOHearingAttendees"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">The court </span>has made a consolidated attachment of earnings order in this case. If it is served on the Debtor's employer it will require him to deduct <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOInstalmentAmount"/> per <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstallmentPeriod"/> from the 
			Debtor's earnings and send it to the court until £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOsNomicBalance1"/>, the amount payable under the order has been paid, but not so as to reduce the Debtor's net pay below <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdProtectEarnRate"/> per <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstallmentPeriod"/>.
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">The court orders </span>that the consolidated attachment of earnings order be suspended and not enforced so long as the Debtor punctually pays instalments of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOInstalmentAmount"/> for every <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstallmentPeriod"/>,
			the first instalment to reach the Court by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderFirstPaymentDate"/> until the sum of £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOsNomicBalance1"/> referred to above has been paid.
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">The court further orders </span>that the service of the consolidated attachment of earnings order on the employer be deferred accordingly.
		</div>
		<div style="margin-bottom: 0.4cm;">
			See over for the details of the orders which have been included in this order.
		</div>
		<div style="text-align: right; margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">Dated </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>