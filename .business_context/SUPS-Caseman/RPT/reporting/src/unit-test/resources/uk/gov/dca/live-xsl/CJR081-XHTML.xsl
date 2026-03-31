<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100D1"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">To</span> the bailiffs of the court and every constable within the district of the court:
		</div>
		<div>
			<span style="font-weight: bold;">On</span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWarrantDate"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/> found that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWhoIs"/> of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWhereIs"/> ('the judgment debtor') had committed a breach of the order to attend court
			for questioning dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioningDate"/> and is accordingly in contempt of court and
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">ordered</span> that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDebtorHeShe"/> be committed for contempt to Her Majesty's Prison <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDisobedienceArrestPrisonName"/> for a period of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDisobedienceArrestCommittalDays"/> days and that the order for
			committal be suspended so long as <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDebtorHeShe"/> attend court at the time and place specified in that order and otherwise comply with the order
			to attend court for questioning dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioningDate"/><xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdOtherRequirement) &gt; 0"> <xsl:value-of select="$vdOtherRequirement"/></xsl:if>.
		</div>
		<div style="margin-bottom: 0.8cm;">
			The court is satisfied that the suspended committal order dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioningOrderDate"/> was served on the judgment debtor on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioningServiceDate"/>
			<xsl:choose xmlns="http://eds.com/supsfo">
				<xsl:when test="$vdQuestioningContempt = 'failed to attend'"> but <xsl:value-of select="$vdDebtorHeShe"/> failed to attend court at that time and place.</xsl:when>
				<xsl:otherwise> and that <xsl:value-of select="$vdDebtorHeShe"/> attended court but failed to comply with the order in that <xsl:value-of select="$vdDebtorHeShe"/> <xsl:value-of select="$vdOtherDetails"/>.</xsl:otherwise>
			</xsl:choose>
		</div>
		<div style="margin-bottom: 0.4cm;">
			You the bailiffs and constables are therefore required to arrest the judgment debtor <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWhoIs"/> and to bring <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDebtorHimHer"/> before a judge to consider whether the committal order should be discharged.
		</div>
		<div>
			Dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$datetoday"/>
		</div>

		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>