<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100A7"><div><font size="2" face="Times New Roman">
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOHearingAttendees"/>
		</div>
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			IT IS ORDERED THAT the administration order made on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCODate"/>
		</div>
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			in favour of the above named debtor be <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSuspendVaried"/>
		</div>
		<div>
			as follows
		</div>
		<div style="margin-bottom: 0.8cm;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdSuspendReason"/>
		</div>
		<div style="text-align: right; margin-bottom: 0.8cm;">
			<span style="font-weight: bold;">Dated </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdHearingOrder != 'Y'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				If you (the debtor or any of his creditors) object to the making of this order, you must write to the court with your reasons.
				You have 16 days from the date of the postmark to do this. A hearing will be arranged and you will be told when to come to court.
			</div>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="(string-length($vdMoneyInCourt) &gt; 0) and ($vdHearingOrder != 'Y')">
			<div xmlns="" style="font-weight: bold; margin-bottom: 0.4cm;">
				To the Creditor
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdMoneyInCourt"/>
			</div>
		</xsl:if>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>