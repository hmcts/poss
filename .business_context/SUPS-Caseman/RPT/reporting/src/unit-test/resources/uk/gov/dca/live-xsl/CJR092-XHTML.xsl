<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100CD"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">On </span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">and the court orders</span> that
		</div>
		<div style="margin-bottom: 0.4cm;">
			1.The third party pay to the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentCreditor"/> ('the judgment creditor') £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPayMoney"/> on or before the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPayMoneyDate"/>.
		</div>
		<div style="margin-bottom: 0.4cm;">
			2. The judgment creditor's costs of this application £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGoodsCostAmount"/> are to be retained out of the money recovered by the judgment creditor under this order in priority to the judgment debt.
		</div>
		
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>