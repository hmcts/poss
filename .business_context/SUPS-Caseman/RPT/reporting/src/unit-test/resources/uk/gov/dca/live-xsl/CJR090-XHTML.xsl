<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10089"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 1.0cm;">
			<span style="font-weight: bold;">On</span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.8cm;">
			sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.8cm;">
			considered the application of the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDebtor"/> ('the judgment debtor')<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdHearingAttendees) &gt; 0"> and <xsl:copy-of select="$vdHearingAttendees"/></xsl:if>.
		</div>
		<div style="margin-bottom: 0.8cm;">
			An interim third party debt order made on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInterimNoticeDate"/> forbids the third party from paying to the judgment debtor or any other person £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInterimOrderTotal"/> or (if less) the amount due from it to the
			judgment debtor until the application of the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentCreditor"/> ('the judgment creditor') is heard, unless the court orders otherwise; it appears that the amount which is due from the third party
			to the judgment debtor (after deducting the expenses allowed on receiving the interim third party debt order) is £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdThirdPartyAmount"/>
		</div>
		<div style="margin-bottom: 0.8cm;">
			<span style="font-weight: bold;">and the court orders</span> that the third party may pay to <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHardship1"/> out of the amount due from it to the judgment debtor £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPaymentAmount"/> on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHardship2"/>.
		</div>
		<div style="margin-bottom: 0.8cm;">
			The question whether one party should bear the other party's costs of this application and, if so, how will be considered on the hearing of the judgment creditor's application.
		</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>