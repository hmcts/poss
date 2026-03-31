<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100D5"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">To</span> the bailiffs of the court and every constable within the district of the court and to the Governor of Her Majesty's Prison
		</div>
		<div>
			<span style="font-weight: bold;">On </span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtDate"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div>
			sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			found that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWhoIs"/> of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWhereIs"/> ('the judgment debtor') had committed a breach of the order to attend court for questioning dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioningDate"/> and is accordingly in contempt of court and
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">ordered that </span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDebtorHeShe"/> be committed for contempt to Her Majesty's Prison <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDisobedienceArrestPrisonName"/> for a period of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDisobedienceArrestCommittalDays"/> days and that the order for committal be suspended so long as <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDebtorHeShe"/>
			attend court at the time and place specified in that order and otherwise comply with the order to attend court for questioning dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioningDate"/><xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdOtherSuspensionDetails) &gt; 0"> <xsl:value-of select="$vdOtherSuspensionDetails"/>.</xsl:if><xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdOtherSuspensionDetails) = 0">.</xsl:if>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">On </span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdArrestDate"/>, the judgment debtor was arrested and brought before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCertifiedNonAttendanceJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/> on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate"/>.
		</div>
		<div>
			The judge was satisfied that
		<div><table width="100%"><colgroup><col width="20" align="center" valign="top"/><col/></colgroup><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
					<span>the judgment debtor <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDisobedienceContempt"/> as required by the order to attend court for questioning dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioningDate"/></span>
				</div></td></tr><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
					at the time and place mentioned in the order for committal dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtDate"/> the judgment debtor did not <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioningContempt2"/>
				</div></td></tr><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
					<span>the conditions for suspension of that order of committal were therefore not met</span>
				</div></td></tr><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
					<span>the judgment debtor persists in the contempt of court and that the order for committal dated the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtDate"/> should not be discharged.</span>
				</div></td></tr></table></div>
		</div>
		<div style="margin-bottom: 0.4cm;">
			You the bailiffs and constables are therefore required to deliver <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWhoIs"/> to the Governor of Her Majesty's Prison <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDisobedienceArrestPrisonName"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			and you the Governor to receive <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDebtorHimHer"/> and safely keep <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDebtorHimHer"/> in prison for <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDisobedienceArrestCommittalDays"/> days from the date of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDebtorHisHer"/> arrest or until lawfully discharged if sooner.
		</div>
		<div>
			Dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWarrantDate"/>
		</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>